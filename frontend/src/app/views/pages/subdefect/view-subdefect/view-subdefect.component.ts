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
  selector: 'kt-view-subdefect',
  templateUrl: './view-subdefect.component.html',
  styleUrls: ['./view-subdefect.component.scss']
})
export class ViewSubdefectComponent implements OnInit, OnDestroy {
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
	}
	
	createForm() {
			this.loadCategory();
			this.loadDefect(this.subdefect.defect.category._id)
			this.subdefectForm = this.subdefectFB.group({
			subdefectid: [{value:this.subdefect.subdefectid, disabled: true}],
			subtype: [{value:this.subdefect.subtype, disabled:true}],
			defect: [{value: this.subdefect.defect._id, disabled:true}],
			category: [{value:this.subdefect.defect.category, disabled:true}],
			priority: [{value:this.subdefect.priority, disabled:true}],
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

	getComponentTitle() {
		let result = `View Defect`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
