import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import {SubdefectModel} from "../../../../core/subdefect/subdefect.model";
import {
	selectLastCreatedSubdefectId,
	selectSubdefectActionLoading,
	selectSubdefectById
} from "../../../../core/subdefect/subdefect.selector";
import {SubdefectService} from '../../../../core/subdefect/subdefect.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CategoryService } from '../../../../core/category/category.service';
import { DefectService } from '../../../../core/defect/defect.service';
import { QueryCategoryModel } from '../../../../core/category/querycategory.model';
import { QueryDefectModel } from '../../../../core/defect/querydefect.model';

@Component({
  selector: 'kt-add-subdefect',
  templateUrl: './add-subdefect.component.html',
  styleUrls: ['./add-subdefect.component.scss']
})
export class AddSubdefectComponent implements OnInit, OnDestroy {
	// Public properties
	subdefect: SubdefectModel;
	SubdefectId$: Observable<string>;
	oldSubdefect: SubdefectModel;
	codenum : any;
	selectedTab = 0;
	loading$: Observable<boolean>;
	selection = new SelectionModel<SubdefectModel>(true, []);
	subdefectForm: FormGroup;
	hasFormErrors = false;
	categoryResult: any[] = [];
	defectResult: any[] = [];
	loadingForm : boolean
	loading : boolean = false
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private subdefectFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: SubdefectService,
		private cservice : CategoryService,
		private dservice : DefectService,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectSubdefectActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectSubdefectById(id))).subscribe(res => {
					if (res) {
						this.subdefect = res;
						this.oldSubdefect = Object.assign({}, this.subdefect);
						this.initSubdefect();
						this.loadingForm = true
					}
				});
			} else {
				this.subdefect = new SubdefectModel();
				this.subdefect.clear();
				this.initSubdefect();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initSubdefect() {
		this.createForm();
		this.loadCategory();
	}
	
	createForm() {
			this.getNumber()
			this.subdefectForm = this.subdefectFB.group({
			subdefectid : [{"value":this.codenum, disabled:true}, Validators.required],
			subtype: ["", Validators.required],
			defect: ["", Validators.required],
			category: ["", Validators.required],
			priority: ["", Validators.required],
		});
	}

	getNumber() {
		this.service.generateSubdefectCode().subscribe(
			res => {
				this.codenum = res.data
				const controls = this.subdefectForm.controls;
				controls.subdefectid.setValue(this.codenum);
			}
		)
		console.log(this.codenum)		
	}

	async loadCategory(){
		this.selection.clear();
		const queryParams = new QueryCategoryModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.cservice.getListCategory(queryParams).subscribe(
			res => {
				this.loadingForm = false
				this.categoryResult = res.data;	
				document.body.style.height = "101%"
				window.scrollTo(0, 1);
				document.body.style.height = ""
			}
		);
	}

	categoryOnChange(item){
		if(item){
			this.loadDefect(item);
		}
	}

	loadDefect(id){
		this.selection.clear();
		const queryParams = new QueryDefectModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.dservice.getListDefectbyCategoryId(id).subscribe(
			res => {
				this.defectResult = res.data;	
			}
		);
	}


	goBackWithId() {
		const url = `/subdefect`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshSubdefect(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/subdefect/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.subdefectForm.controls;
		/** check form */
		if (this.subdefectForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		this.loading = true;
		const editedSubdefect = this.prepareSubdefect();

		if (editedSubdefect._id) {
			this.updateSubdefect(editedSubdefect, withBack);
			return;
		}

		this.addSubdefect(editedSubdefect, withBack);
	}


	prepareSubdefect(): SubdefectModel {
		const controls = this.subdefectForm.controls;
		const _subdefect = new SubdefectModel();
		_subdefect.clear();
		_subdefect._id = this.subdefect._id;
		_subdefect.subdefectid = controls.subdefectid.value;
		_subdefect.subtype = controls.subtype.value.toLowerCase();
		_subdefect.defect = controls.defect.value;
		_subdefect.category = controls.category.value;
		_subdefect.priority = controls.priority.value;
		return _subdefect;
	}

	addSubdefect( _subdefect: SubdefectModel, withBack: boolean = false) {
		const addSubscription = this.service.createSubdefect(_subdefect).subscribe(
			res => {
				const message = `New Sub Detail Location successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/subdefect`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding sub detail location | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	updateSubdefect(_subdefect: SubdefectModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateSubdefect(_subdefect).subscribe(
			res => {
				const message = `Sub detail location successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/subdefect`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding sub detail location | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'Create Defect';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
