import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BudgetingModel } from "../../../../../core/services/budgeting/budgeting.model";
import {
	selectBudgetingActionLoading,
	selectBudgetingById
} from "../../../../../core/services/budgeting/budgeting.selector";
import { BudgetingService } from '../../../../../core/services/budgeting/budgeting.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountTypeService } from '../../../../../core/accountType/accountType.service';
import { AccountGroupService } from '../../../../../core/accountGroup/accountGroup.service';


@Component({
	selector: 'kt-view-budgeting',
	templateUrl: './view-budgeting.component.html',
	styleUrls: ['./view-budgeting.component.scss']
})
export class ViewBudgetingComponent implements OnInit, OnDestroy {
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
	loading: boolean = false;
	selection = new SelectionModel<BudgetingModel>(true, []);
	date1 = new FormControl(new Date());
	date = new Date();
	typeResult: any[] = [];
	accountResult: any[] = [];
	date2 = this.date.getFullYear()
	dataNumber: number;
	time = new FormControl(this.date.getHours() + ":" + this.date.getMinutes())
	// Private properties

	loadingData = {
		acct: false,
		acctType: false
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
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectBudgetingById(id))).subscribe(res => {
					if (res) {
						this.budgeting = res;
						this.oldBudgeting = Object.assign({}, this.budgeting);
						this.initBudgeting();
					}
				});
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	initBudgeting() {
		this.createForm();
		this.loadAccount();
		this.selectTypeChange(this.budgeting.account_type._id)
	}

	createForm() {
		this.budgetingForm = this.budgetingFB.group({
			account_type: [{ value: this.budgeting.account_type._id, disabled: true }],
			account: [{ value: this.budgeting.account, disabled: true }],
			acctName: [{ value: this.budgeting.acctName, disabled: true }],
			acctNo: [{ value: this.budgeting.acctNo, disabled: true }],
			year: [{ value: this.budgeting.year, disabled: true }],
			nominal_budget: [{ value: this.budgeting.nominal_budget, disabled: true }],
			actual_budget: [{ value: this.budgeting.actual_budget, disabled: true }],
			type_budget: [{ value: this.budgeting.type_budget, disabled: true }],
			remark: [{ value: this.budgeting.remark, disabled: true }],
			period1: [{ value: this.budgeting.period1, disabled: true }],
			period2: [{ value: this.budgeting.period2, disabled: true }],
			period3: [{ value: this.budgeting.period3, disabled: true }],
			period4: [{ value: this.budgeting.period4, disabled: true }],
			period5: [{ value: this.budgeting.period5, disabled: true }],
			period6: [{ value: this.budgeting.period6, disabled: true }],
			period7: [{ value: this.budgeting.period7, disabled: true }],
			period8: [{ value: this.budgeting.period8, disabled: true }],
			period9: [{ value: this.budgeting.period9, disabled: true }],
			period10: [{ value: this.budgeting.period10, disabled: true }],
			period11: [{ value: this.budgeting.period11, disabled: true }],
			period12: [{ value: this.budgeting.period12, disabled: true }],
			created_by: [this.datauser],
			created_date: [{ value: this.date1.value, disabled: true }],
		});
	}


	loadAccount() {
		this.selection.clear();
		this.loadingData.acctType = true;
		this.serviceAccounType.getListAccountTypeNoParam().subscribe(
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

	selectFormChange(id) {
		this.serviceCOA.findAccountGroupById(id).subscribe(res => {
			this.budgetingForm.controls.acctName.setValue(res.data.acctName);
			this.budgetingForm.controls.acctNo.setValue(res.data.acctNo);
		})
	}


	inputKeydownHandler(e) {
		let tes
	}
	getbudget() {
		let tes
	}
	getActual() {
		let tes
	}

	goBackWithId() {
		const url = `/budgeting`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshBudgeting(isNew: boolean = false, id: string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/budgeting/view/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	getComponentTitle() {
		let result = 'View Budgeting';
		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
		this.overBudget = false;
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
