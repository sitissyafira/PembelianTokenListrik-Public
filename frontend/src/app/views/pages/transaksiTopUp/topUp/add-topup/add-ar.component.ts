// Angular
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
import {
	selectLastCreatedArId,
	selectArActionLoading,
	selectArById
} from "../../../../../core/trtoken/ar.selector";
import { ArOnServerCreated, ArUpdated } from "../../../../../core/trtoken/ar.action";
import { ArModel } from '../../../../../core/trtoken/ar.model';
import { ArService } from '../../../../../core/trtoken/ar.service';
import { SelectionModel } from "@angular/cdk/collections";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
const moment = _rollupMoment || _moment;
import { default as _rollupMoment, Moment } from 'moment';
import { PowerTransactionService } from '../../../../../core/power/transaction/transaction.service';
import { WaterTransactionService } from '../../../../../core/water/transaction/transaction.service';
import { QueryOwnerTransactionModel } from '../../../../../core/contract/ownership/queryowner.model';


@Component({
	selector: 'kt-add-ar',
	templateUrl: './add-ar.component.html',
	styleUrls: ['./add-ar.component.scss']
})
export class AddArComponent implements OnInit, OnDestroy {
	codenum
	type;
	billstats;

	//listrik
	pemakaianListrik: number;
	datasc: number;
	hasilsc: number;
	datappju: number;
	hasilppju: number;
	dataloss: number;
	allpoweramount: number;
	monthPower: number;

	//water
	monthWater: number;
	allwateramount: number;

	//
	dataAllIPLParse: number;
	isfreeIpl: boolean = false;
	isfreeAbodement: boolean = false;


	//Error Message Water || Electricity
	message: string;
	hasError: boolean = false;

	topup: ArModel;
	topupId$: Observable<string>;
	oldTopUp: ArModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	topupForm: FormGroup;
	hasFormErrors = false;
	isMonthDifferents = false
	unitResult: any[] = [];
	orderanResult: any[] = [];
	mtdPembayaranResult: any[] = [];
	bankTransferResult: any[] = [];
	customerResult: any[] = [];
	powerResult: any[] = [];
	waterResult: any[] = [];
	selection = new SelectionModel<ArModel>(true, []);
	date1 = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	duedate = new FormControl();
	topupSave: boolean = false;
	OrderanResultFiltered = [];
	MtdPembayaranResultFiltered = [];
	BankTransferResultFiltered = [];
	UnitResultFiltered = [];
	viewBlockResult = new FormControl();
	viewBankResult = new FormControl();


	// Select bank transfer START
	account_no: boolean = false
	account_name: boolean = false
	// Select bank transfer END

	// Select input START
	orderanInput: boolean = false
	mtdPembayaranInput: boolean = false
	// Select input END

	// submit START
	totalBiaya: Number = 0
	mtdPembayaran: string = ""
	idMtdPembayaran: string = ""
	// submit END

	cekPembayaranBtn: boolean = false

	// check select metode pembayaran START
	manual: boolean = false
	edc: boolean = false
	// check select metode pembayaran END

	loadingData = {
		unit: false,
	}

	showSpinner = false;

	billmntE: Date;
	billmntW: Date;

	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private topupFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private serviceBill: ArService,
		private powerservice: PowerTransactionService,
		private waterservice: WaterTransactionService,
		private cd: ChangeDetectorRef,
	) { }

	ngOnInit() {


		this.loading$ = this.store.pipe(select(selectArActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectArById(id))).subscribe(res => {
					if (res) {
						this.topup = res;
						this.oldTopUp = Object.assign({}, this.topup);
						this.initTopUp();
					}
				});
			} else {
				this.topup = new ArModel();
				this.topup.clear();
				this.initTopUp();
			}
		});
		this.subscriptions.push(routeSubscription);
	}
	initTopUp() {
		this.createForm();
		this.loadOrderan();
		this.loadUnit();
		this.loadMtdPembayaran();
		this.loadBankTransfer()
	}

	loadData() {
		this.showSpinner = true;
		setTimeout(() => {
			this.showSpinner = false;
		}, 1000);

	}

	createForm() {
		this.topupForm = this.topupFB.group({
			namePrabayar: [{ value: this.topup.namePrabayar, disabled: true }],
			adminRate: this.topupFB.group({
				adminRate: [{ value: "", disabled: true }],
			}),
			totalBiaya: this.topupFB.group({
				totalBiaya: [{ value: "", disabled: false }],
			}),
			topup_number: [{ value: this.codenum, disabled: true }, Validators.required],
			topup_date: [{ value: this.date1.value, disabled: false }, Validators.required],

			idRate: [{ value: "", disabled: false }],
			idUnit: [{ value: "", disabled: false }],
			bankTransfer: [{ value: "", disabled: false }],

			account_no: [{ value: "", disabled: false }],
			account_name: [{ value: "", disabled: false }],

			card_no: [{ value: "", disabled: false }],
			name_card: [{ value: "", disabled: false }],
		});
		this.getTopUpNumber();
	}

	getTopUpNumber() {
		this.serviceBill.getCodeTransaksi().subscribe(
			res => {

				console.log(res);

				this.codenum = res.data;
				const controls = this.topupForm.controls;
				controls.topup_number.setValue(this.codenum);
			}
		);
	}

	// validate select metode pembayaran START
	checkMtdPembayaran(status: string, id: string) {

		console.log(status);
		this.idMtdPembayaran = id
		this.mtdPembayaran = status

		if (status === "manual") {
			this.manual = true
			this.edc = false
		} else if (status === "edc") {
			this.edc = true
			this.manual = false
		} else if (status === "cash" || status === "ipaymu") {
			this.manual = false
			this.edc = false
		}
	}
	// validate select metode pembayaran END

	addIdRate(value: string) {
		const controls = this.topupForm.controls;
		this.topupForm.controls.idRate.setValue(value);
	}
	addIdUnit(value: string) {
		const controls = this.topupForm.controls;
		this.topupForm.controls.idUnit.setValue(value);
	}
	addNameBank(value: string) {
		const controls = this.topupForm.controls;
		this.topupForm.controls.bankTransfer.setValue(value);
	}
	/**
	 * @param value
	 */
	_setBlockValue(value) {
		this.topupForm.patchValue({ unit: value._id });
		this.unitOnChange(value._id);
	}

	_setBankTransfer(value) {
		this.addNameBank(value.bank)
		this.account_no = true
		this.account_name = true
	}

	_setMtdPembayaran(value) {
		this.checkMtdPembayaran(value.name, value._id)
		this.cekPembayaranBtn = true
	}

	_setIdRate(value) {
		this.topupForm.patchValue({ unit: value._id });
		this.unitOnChange(value._id);
		this.addIdRate(value._id)
		this.mtdPembayaranInput = true
	}

	_setIdUnit(value) {
		this.addIdUnit(value._id)
		this.orderanInput = true
	}

	_onKeyup(e: any) {
		this.topupForm.patchValue({ unit: undefined });
		this._filterCstmrList(e.target.value);
	}
	_onKeyupBank(e: any) {
		this.topupForm.patchValue({ bank: undefined });
		this._filterBankList(e.target.value);
	}

	_filterCstmrList(text: string) {
		this.UnitResultFiltered = this.unitResult.filter(i => {
			const filterText = `${i.cdunt.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}
	_filterBankList(text: string) {
		this.BankTransferResultFiltered = this.bankTransferResult.filter(i => {
			const filterText = `${i.bank.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}

	loadOrderan() {
		this.loadingData.unit = true
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(
			null,
			"asc",
			"grpnm",
			1,
			10000
		);
		this.serviceBill.getDataOrderan(queryParams).subscribe(
			res => {
				console.log(res, 'orderan result');
				this.orderanResult = res.data;
				console.log(this.orderanResult);
				this.OrderanResultFiltered = this.orderanResult.slice();
			}
		);
	}

	loadUnit() {
		this.loadingData.unit = true
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(
			null,
			"asc",
			"grpnm",
			1,
			10000
		);
		this.serviceBill.getAllUnit(queryParams).subscribe(
			res => {
				console.log(res, 'unit result');
				this.unitResult = res.data;
				console.log(this.unitResult);
				this.UnitResultFiltered = this.unitResult.slice();
			}
		);
	}
	loadMtdPembayaran() {
		this.loadingData.unit = true
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(
			null,
			"asc",
			"grpnm",
			1,
			10000
		);
		this.serviceBill.getMtdPembayaran(queryParams).subscribe(
			res => {
				console.log(res, 'orderan mtd pembayaran');
				this.mtdPembayaranResult = res.data;
				console.log(this.mtdPembayaranResult);
				this.MtdPembayaranResultFiltered = this.mtdPembayaranResult.slice();

			}
		);
	}
	loadBankTransfer() {
		this.loadingData.unit = true
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(
			null,
			"asc",
			"grpnm",
			1,
			10000
		);
		this.serviceBill.getBankTransfer(queryParams).subscribe(
			res => {
				console.log(res, 'orderan bank transfer');
				this.bankTransferResult = res.data;
				console.log(this.bankTransferResult);
				this.BankTransferResultFiltered = this.bankTransferResult.slice();
			}
		);
	}

	unitOnChange(id) {
		this.serviceBill.findOrderanById(id).subscribe(
			data => {
				this.getDataOrderan(id)
			}
		)
	}

	getDataOrderan(id) {
		this.serviceBill.findOrderanById(id).subscribe(
			res => {
				console.log("test5");
				const controls = this.topupForm.controls;
				this.topupForm.controls.namePrabayar.setValue(res.data[0].rate);
				controls.adminRate.get('adminRate').setValue(res.data[0].adminRate)
				const total = res.data[0].rate + res.data[0].adminRate

				console.log(total);

				// format rupiah
				const numb = total;
				const format = numb.toString().split('').reverse().join('');
				const convert = format.match(/\d{1,3}/g);
				const rupiah = 'Rp ' + convert.join('.').split('').reverse().join('')

				controls.totalBiaya.get('totalBiaya').setValue(rupiah)

				this.totalBiaya = total
			}
		)
	}


	getAlldata() {
		const controls = this.topupForm.controls;
		// controls.totalTopUp.setValue("");
		const dataFreeAbodement = controls.isFreeAbodement.value
		const dataFreeIPL = controls.isFreeIpl.value
		const dataPower = controls.power.get('allPowerAmount').value;
		const dataWater = controls.water.get('allWaterAmount').value;
		const dataIPL = controls.ipl.get('allIpl').value;

		if (dataIPL !== null || dataPower !== 0 || dataWater !== 0) {
			if (dataFreeAbodement === true && dataFreeIPL === false) {
				const dataPower2 = dataPower * 0
				const dataWater2 = dataWater * 0
				const dataIPL = this.dataAllIPLParse;
				controls.ipl.get('allIpl').setValue(dataIPL);
				controls.power.get('allPowerAmount').setValue(dataPower2);
				controls.water.get('allWaterAmount').setValue(dataWater2);
				controls.totalTopUp.setValue(dataPower2 + dataWater2 + dataIPL);
			} else if (dataFreeAbodement === false && dataFreeIPL === true) {
				let dataIPL2 = ""
				if (controls.ipl.get('monthIpl').value !== 0) {
					dataIPL2 = Math.round((controls.ipl.get('unitSize').value * controls.ipl.get('ipl').value) * (controls.ipl.get('monthIpl').value - 1)).toFixed(0)
				} else {
					dataIPL2 = Math.round((controls.ipl.get('unitSize').value * controls.ipl.get('ipl').value) * (controls.ipl.get('monthIpl').value * 0)).toFixed(0)
				}
				const dataIPL2Parse = parseInt(dataIPL2)
				const dataPower = this.allpoweramount;
				const dataWater = this.allwateramount;
				controls.ipl.get('allIpl').setValue(dataIPL2Parse);
				controls.power.get('allPowerAmount').setValue(this.allpoweramount);
				controls.water.get('allWaterAmount').setValue(this.allwateramount);
				controls.totalTopUp.setValue(dataPower + dataWater + dataIPL2Parse);

			} else if (dataFreeAbodement === true && dataFreeIPL === true) {
				const dataPower3 = dataPower * 0
				const dataWater3 = dataWater * 0
				let dataIPL3 = ""
				if (controls.ipl.get('monthIpl').value !== 0) {
					dataIPL3 = Math.round((controls.ipl.get('unitSize').value * controls.ipl.get('ipl').value) * (controls.ipl.get('monthIpl').value - 1)).toFixed(0)
				} else {
					dataIPL3 = Math.round((controls.ipl.get('unitSize').value * controls.ipl.get('ipl').value) * (controls.ipl.get('monthIpl').value * 0)).toFixed(0)
				}
				const dataIPL3Parse = parseInt(dataIPL3)
				controls.power.get('allPowerAmount').setValue(dataPower3);
				controls.water.get('allWaterAmount').setValue(dataWater3);
				controls.ipl.get('allIpl').setValue(dataIPL3Parse);
				controls.totalTopUp.setValue(dataWater3 + dataPower3 + dataIPL3Parse);
			} else {
				const dataPower = this.allpoweramount;
				const dataWater = this.allwateramount;
				const dataIPL = this.dataAllIPLParse;
				controls.ipl.get('allIpl').setValue(dataIPL);
				controls.power.get('allPowerAmount').setValue(this.allpoweramount);
				controls.water.get('allWaterAmount').setValue(this.allwateramount);
				controls.totalTopUp.setValue(dataPower + dataWater + dataIPL);
			}
		} else {
			console.log("Tes");
		}
	}

	prepareTopUp() {
		const controls = this.topupForm.controls;
		const _topup = new ArModel();

		_topup.idRate = controls.idRate.value
		_topup.idUnit = controls.idUnit.value
		_topup.topup_number = controls.topup_number.value
		_topup.bank_tf = controls.bankTransfer.value

		_topup.account_no = controls.account_no.value
		_topup.account_name = controls.account_name.value

		_topup.card_no = controls.card_no.value
		_topup.name_card = controls.name_card.value

		_topup.tglTransaksi = controls.topup_date.value


		if (_topup.bank_tf === "" || _topup.account_no === null || _topup.account_name === "") {
			_topup.bank_tf = undefined
			_topup.account_no = undefined
			_topup.account_name = undefined
		}
		if (_topup.card_no === null || _topup.name_card === "") {
			_topup.card_no = undefined
			_topup.name_card = undefined
		}



		const results = {
			cdTransaksi: _topup.topup_number,
			idRate: _topup.idRate,
			idUnit: _topup.idUnit,
			totalBiaya: this.totalBiaya,
			tglTransaksi: _topup.tglTransaksi,
			mtdPembayaran: this.mtdPembayaran,
			idMtdPembayaran: this.idMtdPembayaran,
			// payment manual
			bank_tf: _topup.bank_tf,
			account_no: _topup.account_no,
			account_name: _topup.account_name,
			proof_of_payment: undefined,
			// payment edc
			card_no: _topup.card_no,
			name_card: _topup.name_card
		}

		return results;
	}

	onSubmit = async (withBack: boolean = false) => {
		try {
			const editedTopUp = this.prepareTopUp();

			this.addTopUp(editedTopUp, withBack);
		} catch (error) {
			console.log(error);
			this.layoutUtilsService.showActionNotification(error, MessageType.Create, 5000, true, true);
		}
	}

	addTopUp(_topup, withBack: boolean = false) {


		const addSubscription = this.serviceBill.createTransaksiToken(_topup).subscribe(
			res => {
				console.log(res);

				if (res) {
					const id = res.data._id
					const message = `New topup successfully has been added.`;
					this.layoutUtilsService.showActionNotification(message);
					// this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
					const url = `/transaksi-topup/${id}`;
					this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
				}
			},
			err => {
				console.error(err);
				const message = 'Error while adding topup | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		const controls = this.topupForm.controls;
		controls.due_date.setValue(moment(event.value, 'MM/DD/YYYY').add(15, 'day').toDate());
	}

	getComponentTitle() {
		let result = 'Top Up Listrik';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
		this.hasError = false;
	}

	goBackWithId() {
		const url = `/topup`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshTopUp(isNew: boolean = false, id: string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/topup/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
}
