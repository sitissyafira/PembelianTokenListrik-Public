import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {  Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import {BudgetingModel} from "../../../../../core/services/budgeting/budgeting.model";
import {
	selectBudgetingActionLoading,
	selectBudgetingById
} from "../../../../../core/services/budgeting/budgeting.selector";
import { BudgetingService } from '../../../../../core/services/budgeting/budgeting.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountTypeService } from '../../../../../core/accountType/accountType.service';
import { AccountGroupService } from '../../../../../core/accountGroup/accountGroup.service';


@Component({
  selector: 'kt-add-budgeting',
  templateUrl: './add-budgeting.component.html',
  styleUrls: ['./add-budgeting.component.scss']
})
export class AddBudgetingComponent implements OnInit, OnDestroy {
	type;
	datauser = localStorage.getItem("user");
	budgeting: BudgetingModel;
	BudgetingId$: Observable<string>;
	oldBudgeting: BudgetingModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	budgetingForm: FormGroup;
	hasFormErrors = false;
	overBudget = false;
	unitResult: any[] = [];
	loading : boolean = false;
	selection = new SelectionModel<BudgetingModel>(true, []);
	date1 = new FormControl(new Date());
	date = new Date();
	typeResult: any[] = [];
	accountResult : any[]=[];
	date2 = this.date.getFullYear()
	dataNumber : number;
	time = new FormControl(this.date.getHours() + ":" + this.date.getMinutes())
	// Private properties

	private loadingData = {
		acct : false,
		acctType : false
	}
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private budgetingFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: BudgetingService,
		private serviceCOA: AccountGroupService,
		private serviceAccounType: AccountTypeService,
		private layoutConfigService: LayoutConfigService,
		private cdr: ChangeDetectorRef
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectBudgetingActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectBudgetingById(id))).subscribe(res => {
					if (res) {
						this.budgeting = res;
						this.oldBudgeting = Object.assign({}, this.budgeting);
						this.initBudgeting();
					}
				});
			} else {
				this.budgeting = new BudgetingModel();
				this.budgeting.clear();
				this.initBudgeting();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initBudgeting() {
		this.createForm();
		this.loadAccount();
		this.getbudget();
		this.getActual();
	}

	createForm() {
		this.budgetingForm = this.budgetingFB.group({
		account_type: [""],
		account: [""],
		acctName: [""],
		acctNo: [""],
		year: [{value:this.date2, disabled:true}],
		nominal_budget:[""],
		actual_budget : [{value:"", disabled:true}],
		type_budget : [""],
		remark: [""],
		period1: [""],
		period2: [""],
		period3: [""],
		period4: [""],
		period5: [""],
		period6: [""],
		period7: [""],
		period8: [""],
		period9: [""],
		period10: [""],
		period11: [""],
		period12: [""],
		created_by: [this.datauser],
		created_date: [{value:this.date1.value, disabled:true}],
		});
	}

	getbudget(){
		const data = this.budgetingForm.controls.type_budget.value;
		const dataValue = this.budgetingForm.controls.nominal_budget.value;
			if (data === "samarata" && dataValue >= 0){
				const data2 = (dataValue / 12).toFixed()
				const dataConvert = parseInt(data2)
				console.log(dataConvert);
				this.cdr.markForCheck();
				this.budgetingForm.controls.period1.setValue(dataConvert);
				this.budgetingForm.controls.period2.setValue(dataConvert);
				this.budgetingForm.controls.period3.setValue(dataConvert);
				this.budgetingForm.controls.period4.setValue(dataConvert);
				this.budgetingForm.controls.period5.setValue(dataConvert);
				this.budgetingForm.controls.period6.setValue(dataConvert);
				this.budgetingForm.controls.period7.setValue(dataConvert);
				this.budgetingForm.controls.period8.setValue(dataConvert);
				this.budgetingForm.controls.period9.setValue(dataConvert);
				this.budgetingForm.controls.period10.setValue(dataConvert);
				this.budgetingForm.controls.period11.setValue(dataConvert);
				this.budgetingForm.controls.period12.setValue(dataConvert);
				this.getActual();
			}else{
				this.budgetingForm.controls.period1.setValue(0);
				this.budgetingForm.controls.period2.setValue(0);
				this.budgetingForm.controls.period3.setValue(0);
				this.budgetingForm.controls.period4.setValue(0);
				this.budgetingForm.controls.period5.setValue(0);
				this.budgetingForm.controls.period6.setValue(0);
				this.budgetingForm.controls.period7.setValue(0);
				this.budgetingForm.controls.period8.setValue(0);
				this.budgetingForm.controls.period9.setValue(0);
				this.budgetingForm.controls.period10.setValue(0);
				this.budgetingForm.controls.period11.setValue(0);
				this.budgetingForm.controls.period12.setValue(0);
				this.getActual();
			}
	}

	loadAccount() {
		this.selection.clear();
		this.loadingData.acctType = true;
		this.serviceAccounType.getListAccountTypeNoParamAccBudget().subscribe(
			res => {
				this.typeResult = res.data;
				this.loadingData.acctType = false;
				this.cdr.markForCheck();
			}
		);
	}

	selectTypeChange(id) {
		console.log(id);
		// const controls = this.budgetingForm.controls;
		this.loadingData.acct = true;
		// controls.account.setValue("");
		this.serviceCOA.getListByType(id).subscribe(res => {
				this.accountResult = res.data;
				this.loadingData.acct = false;
		});
		
	}

	selectFormChange(id){
		this.serviceCOA.findAccountGroupById(id).subscribe(res =>{
			this.budgetingForm.controls.acctName.setValue(res.data.acctName);
			this.budgetingForm.controls.acctNo.setValue(res.data.acctNo);
		})
	}


	getActual(){
		const data1 = parseInt(this.budgetingForm.controls.period1.value);
		const data2 = parseInt(this.budgetingForm.controls.period2.value);
		const data3 = parseInt(this.budgetingForm.controls.period3.value);
		const data4 = parseInt(this.budgetingForm.controls.period4.value);
		const data5 = parseInt(this.budgetingForm.controls.period5.value);
		const data6 = parseInt(this.budgetingForm.controls.period6.value);
		const data7 = parseInt(this.budgetingForm.controls.period7.value);
		const data8 = parseInt(this.budgetingForm.controls.period8.value);
		const data9 = parseInt(this.budgetingForm.controls.period9.value);
		const data10 = parseInt(this.budgetingForm.controls.period10.value);
		const data11 = parseInt(this.budgetingForm.controls.period11.value);
		const data12 = parseInt(this.budgetingForm.controls.period12.value);
		if (data1 >= 0){
			const controls = this.budgetingForm.controls;
			const data = data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12
			this.budgetingForm.controls.actual_budget.setValue(data);
			const dataNominal = controls.nominal_budget.value
			if (data > dataNominal){
				this.overBudget = true
				this.loading = true
			}else{
				this.overBudget = false
				this.loading = false 
			}
		}

		
	}


	goBackWithId() {
		const url = `/budgeting`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshBudgeting(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/budgeting/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}


	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.budgetingForm.controls;
		/** check form */
		if (this.budgetingForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}


		this.loading = true;
		const editedBudgeting = this.prepareBudgeting();
		this.addBudgeting(editedBudgeting, withBack);
	}

	prepareBudgeting(): BudgetingModel {
		const controls = this.budgetingForm.controls;
		const _budgeting = new BudgetingModel();
		_budgeting.clear();
		_budgeting._id = this.budgeting._id;
		_budgeting.account_type = controls.account_type.value;
		_budgeting.account = controls.account.value;
		_budgeting.acctName = controls.acctName.value;
		_budgeting.acctNo = controls.acctNo.value;
		_budgeting.year = controls.year.value;
		_budgeting.type_budget = controls.type_budget.value;
		_budgeting.actual_budget = controls.actual_budget.value;
		_budgeting.nominal_budget = controls.nominal_budget.value;
		_budgeting.remark = controls.remark.value;
		_budgeting.period1 = controls.period1.value;
		_budgeting.period2 = controls.period2.value;
		_budgeting.period3 = controls.period3.value;
		_budgeting.period4 = controls.period4.value;
		_budgeting.period5 = controls.period5.value;
		_budgeting.period6 = controls.period6.value;
		_budgeting.period7 = controls.period7.value;
		_budgeting.period8 = controls.period8.value;
		_budgeting.period9 = controls.period9.value;
		_budgeting.period10 = controls.period10.value;
		_budgeting.period11 = controls.period11.value;
		_budgeting.period12 = controls.period12.value;
		_budgeting.created_by = controls.created_by.value;
		_budgeting.created_date = controls.created_date.value;
		return _budgeting;
	}

	addBudgeting( _budgeting: BudgetingModel, withBack: boolean = false) {
		const addSubscription = this.service.createBudgeting(_budgeting).subscribe(
			res => {
				const message = `New package successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/budgeting`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding package | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	getComponentTitle() {
		let result = 'Create Budgeting';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
		this.overBudget = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	inputKeydownHandler(event) {
		return event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key)) || event.key === '.';
	}
	
}
