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
  selector: 'kt-edit-subdefect',
  templateUrl: './edit-subdefect.component.html',
  styleUrls: ['./edit-subdefect.component.scss']
})
export class EditSubdefectComponent implements OnInit, OnDestroy {
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
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initSubdefect() {
		this.createForm();
		this.loadCategory();
		this.categoryOnChange(this.subdefect.defect.category)
		// this.loadDefect(this.subdefect.defect.category._id);
	}
	
	createForm() {
			this.subdefectForm = this.subdefectFB.group({
			subdefectid: [{value:this.subdefect.subdefectid, disabled: true}, Validators.required],
			subtype: [this.subdefect.subtype, Validators.required],
			defect: [this.subdefect.defect._id, Validators.required],
			category: [this.subdefect.defect.category, Validators.required],
			priority: [this.subdefect.priority, Validators.required],
		});
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
		this.updateSubdefect(editedSubdefect, withBack);
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
		let result = `Edit Defect`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
