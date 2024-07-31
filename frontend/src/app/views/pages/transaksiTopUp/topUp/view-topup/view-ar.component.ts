import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
import {
	selectArActionLoading,
	selectArById
} from "../../../../../core/finance/ar/ar.selector";
// import { ArService } from '../../../../../core/finance/ar/ar.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ArService } from '../../../../../core/trtoken/ar.service';
import { QueryTopUpModel } from '../../../../../core/topup/querytopup.model';
import { ArModel } from '../../../../../core/trtoken/ar.model';
import moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { rearg } from 'lodash';

@Component({
	selector: 'kt-view-ar',
	templateUrl: './view-ar.component.html',
	styleUrls: ['./view-ar.component.scss']
})
export class ViewArComponent implements OnInit, OnDestroy {
	topup: ArModel;
	ArId$: Observable<string>;
	oldAr: ArModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	selection = new SelectionModel<ArModel>(true, []);
	arResult: any[] = [];
	glResult: any[] = [];

	checkNoTokenAndEngineer: boolean = false
	checkDetailMtdPembayaran: boolean = false
	checkDetailMtdPembayaranEDC: boolean = false

	// d-none input start
	checkNoToken: boolean = false
	checkEngineer: boolean = false
	checkSwitcher: boolean = false
	progressEngineerImage: string = ""
	// d-none input end

	// upload image start
	images: any[] = []
	imagesEngineer: any[] = []
	myFiles: any[] = []
	myFilesEngineer: any[] = []
	valueFiles = {}
	valueFilesEngineer = {}
	@ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;
	// upload image end

	arForm: FormGroup;
	date1 = new FormControl(new Date());
	hasFormErrors = false;
	isStatus: boolean = false;
	private subscriptions: Subscription[] = [];
	loading = {
		deposit: false,
		submit: false,
		glaccount: false
	}

	valueNoToken: Number = 0
	valueIdEngineer: string = ""

	arListResultFiltered = [];
	viewArResult = new FormControl();
	gLListResultFiltered = [];
	viewGlResult = new FormControl();

	// Handle PAID START
	valuePaid: string = ""
	valuePrgrTransaksi: string = ""
	idDetailTransaksi: string = ""
	// Handle PAID END


	engineerResult: any[] = [];
	EngineerResultFiltered = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private arFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private serviceTopUp: ArService,
		// upload image
		private cdr: ChangeDetectorRef,
		private http: HttpClient

	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectArActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.serviceTopUp.getDetailTransaksi(id).subscribe(res => {
					if (res) {
						console.log(res);
						const rate = res.data.idRate
						const unit = res.data.idUnit.cdunt
						const companyBank = res.compBank


						// format rupiah
						const numbTotalBiaya = res.data.totalBiaya;
						const formatTotalBiaya = numbTotalBiaya.toString().split('').reverse().join('');
						const convertTotalBiaya = formatTotalBiaya.match(/\d{1,3}/g);
						const totalBiaya = 'Rp ' + convertTotalBiaya.join('.').split('').reverse().join('')

						// format rupiah
						const numbHarga = res.data.idRate.rate;
						const formatHarga = numbHarga.toString().split('').reverse().join('');
						const convertHarga = formatHarga.match(/\d{1,3}/g);
						const harga = 'Rp ' + convertHarga.join('.').split('').reverse().join('')

						// format rupiah
						const numbAdminRate = res.data.idRate.adminRate;
						const formatAdminRate = numbAdminRate.toString().split('').reverse().join('');
						const convertAdminRate = formatAdminRate.match(/\d{1,3}/g);
						const adminRate = 'Rp ' + convertAdminRate.join('.').split('').reverse().join('')

						const tglTransaksi = moment(res.data.tglTransaksi).format('LL');

						const datas = {
							...res.data, tglTransaksi, namePrabayar: rate.name, rate: harga,
							adminRate, nameUnit: unit, companyBank, totalBiaya,
							imagePayment: `${environment.baseAPI}${res.data.proof_of_payment}`
						}
						// const datas = {
						// 	...res.data, tglTransaksi, namePrabayar: rate.name, rate: harga,
						// 	adminRate, nameUnit: unit, companyBank: companyBank[0].bank.bank,
						// 	nameCompany: companyBank[0].acctName, accountNumberCompany: companyBank[0].acctNum, totalBiaya,
						// 	imagePayment: `${environment.baseAPI}${res.data.proof_of_payment}`
						// }

						console.log(res.dataEngineer);


						if (res.data.engineer !== null) {
							this.valueIdEngineer = res.dataEngineer._id
						}

						if (res.data.statusPayment === 'in process' || res.data.prgrTransaksi === 'in progress') {
							this.valuePaid = 'in process'
							this.valuePrgrTransaksi = 'in progress'
						}

						if (res.data.noToken !== 0) {
							this.valueNoToken = res.data.noToken
						}

						if (res.data.statusPayment === 'done') {
							this.valuePaid = 'done'
							this.valuePrgrTransaksi = 'in progress'
						}

						this.topup = datas

						if (res.data.mtdPembayaran === "manual") {
							this.checkDetailMtdPembayaran = true
						} else if (res.data.mtdPembayaran === "edc") {
							this.checkDetailMtdPembayaranEDC = true
						}


						if (res.data.noToken === undefined && res.data.engineer === null) {
							this.checkNoToken = true
							this.checkEngineer = true
						}

						if (res.data.noToken === undefined && res.data.engineer !== null) {
							this.checkNoToken = true
							this.checkSwitcher = true
						}
						if (res.data.noToken !== undefined && res.data.engineer === null) {
							this.checkEngineer = true
							this.checkSwitcher = true
						}

						this.initAr()

					}
				});


			}
			this.serviceTopUp.getProgressEngineer(id).subscribe(res => {
				if (res) {
					console.log(res.engineerProof);

					this.progressEngineerImage = res.engineerProof
				}
			})
		});
		this.subscriptions.push(routeSubscription);
	}

	initAr() {
		this.createForm();
		this.loadEngineer()
	}

	createForm() {
		this.arForm = this.arFB.group({
			depositTo: [{ value: "" }],
			engineer: [{ value: "", disabled: false }],
			noToken: [{ value: 0, disabled: false }],
		});
	}

	changeStatus() {
		const controls = this.arForm.controls;
		if (this.isStatus == true) {
			controls.status.setValue(true)

		} else {
			controls.status.setValue(false)
		}
		console.log(controls.status.value)
	}


	/**
	* @param value
	*/
	_setArValue(value) {
		this.arForm.patchValue({ depositTo: value._id });
	}

	_setEngineerValue(value) {
		const controls = this.arForm.controls;
		this.valueIdEngineer = value._id
	}
	_onKeyup(e: any) {
		this.arForm.patchValue({ depositTo: undefined });
		this._filterCashbankList(e.target.value);
	}

	_filterCashbankList(text: string) {
		this.arListResultFiltered = this.arResult.filter(i => {
			const filterText = `${i.acctName.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}




	/**
	* @param value
	*/
	_setGlValue(value) {
		this.arForm.patchValue({ glaccount: value._id });
	}

	_onKeyupGL(e: any) {
		this.arForm.patchValue({ glaccount: undefined });
		this._filterGLList(e.target.value);
	}

	_filterGLList(text: string) {
		this.arListResultFiltered = this.arResult.filter(i => {
			const filterText = `${i.acctName.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}

	getValueToken(e: any) {
		const controls = this.arForm.controls;
		this.valueNoToken = e.target.value
	}

	onSubmit(withBack: boolean = false) {

		const editedAr = this.prepareAr();
		this.updateAr(editedAr, this.idDetailTransaksi, withBack);
	}

	prepareAr() {
		let results = {}
		// const controls = this.arForm.controls;
		// const _ar = new ArModel();

		let formData: any = new FormData();

		// _ar.idEngineer = controls.engineer.value
		// _ar.noToken = controls.noToken.value

		// if (_ar.idEngineer === '') {
		// 	_ar.idEngineer = undefined
		// }

		console.log(this.valueIdEngineer, 'value enginer');


		if (this.valueIdEngineer !== undefined && this.valueIdEngineer !== "") {
			formData.append("engineer", this.valueIdEngineer);
		}
		if (this.valueNoToken !== undefined) {
			formData.append("noToken", this.valueNoToken);
		}

		console.log(this.valueNoToken);


		if (this.valuePaid === "done") {
			this.valuePrgrTransaksi = "in progress"
		}

		if (this.valueFiles[0] !== undefined && this.valueFilesEngineer !== undefined) {
			formData.append("proof_of_payment", this.valueFiles[0]);
		}

		formData.append("image", this.valueFilesEngineer[0]);
		console.log(this.valueFiles[0]);
		console.log(this.valueFilesEngineer[0]);

		console.log(this.valuePaid);


		formData.append("statusPayment", this.valuePaid);
		formData.append("prgrTransaksi", this.valuePrgrTransaksi);

		this.activatedRoute.params.subscribe(params => {


			this.idDetailTransaksi = params.id

			// 	results = {
			// 		_id: params.id,
			// 		engineer: _ar.idEngineer,
			// 		noToken: _ar.noToken,
			// 		prgrTransaksi: this.valuePaid,
			// 		statusPayment: this.valuePrgrTransaksi === "" ? undefined : this.valuePrgrTransaksi
			// 	}
		})

		return formData;
	}

	handlePaid(e: any) {
		if (e.target.checked === true) {
			this.valuePaid = "done"
		} else {
			this.valuePaid = "in process"
		}
	}


	loadEngineer() {
		this.serviceTopUp.getDataEngineer().subscribe(
			res => {
				console.log(res, 'engineer result');
				this.engineerResult = res.data;
				console.log(this.engineerResult);
				this.EngineerResultFiltered = this.engineerResult.slice();
			}
		);
	}

	updateAr(topup, _id, withBack: boolean = false) {

		const addSubscription = this.serviceTopUp.updateDetailTransaksi(topup, _id).subscribe(
			res => {
				this.loading.submit = false;
				const message = `Account Receive successfully has been saved.`;
				// this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				this.layoutUtilsService.showActionNotification(message);
				const url = `/transaksi-topup`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				this.loading.submit = false;
				const message = 'Error while adding account receive | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = `Detail Top Up Listrik`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	inputKeydownHandler(event) {
		return event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key))
	}

	// get checked Start
	getCheckedSwitch(e: any) {
		if (e.target.checked === true) {
			this.checkNoTokenAndEngineer = true
		} else {
			this.checkNoTokenAndEngineer = false
		}
	}
	// get checked End

	// upload Image
	selectFile(e) {
		const files = (e.target as HTMLInputElement).files;
		this.valueFiles = files
		for (let i = 0; i < files.length; i++) {
			// Skip uploading if file is already selected
			const alreadyIn = this.myFiles.filter(tFile => tFile.name === files[i].name).length > 0;
			if (alreadyIn) continue;

			this.myFiles.push(files[i]);

			const reader = new FileReader();
			reader.onload = () => {
				this.images.push({ name: files[i].name, url: reader.result });
				this.cdr.markForCheck();
			}
			reader.readAsDataURL(files[i]);
		}
		console.log(files);

	}
	removeSelectedFile(item) {
		this.myFiles = this.myFiles.filter(i => i.name !== item.name);
		this.images = this.images.filter(i => i.url !== item.url);
		this.fileInputEl.nativeElement.value = "";

		this.cdr.markForCheck();
	}

	// tes
	selectFileEngineer(e) {
		const files = (e.target as HTMLInputElement).files;
		this.valueFilesEngineer = files
		for (let i = 0; i < files.length; i++) {
			// Skip uploading if file is already selected
			const alreadyIn = this.myFilesEngineer.filter(tFile => tFile.name === files[i].name).length > 0;
			if (alreadyIn) continue;

			this.myFilesEngineer.push(files[i]);

			const reader = new FileReader();
			reader.onload = () => {
				this.imagesEngineer.push({ name: files[i].name, url: reader.result });
				this.cdr.markForCheck();
			}
			reader.readAsDataURL(files[i]);
		}
		console.log(files);

		this.valuePrgrTransaksi = 'done'

	}
	removeSelectedFileEngineer(item) {
		this.myFilesEngineer = this.myFilesEngineer.filter(i => i.name !== item.name);
		this.imagesEngineer = this.imagesEngineer.filter(i => i.url !== item.url);
		this.fileInputEl.nativeElement.value = "";
		this.valuePrgrTransaksi = 'in progress'
		this.cdr.markForCheck();
	}

	clearSelection() {
		this.myFiles = [];
		this.images = [];
		this.myFilesEngineer = [];
		this.imagesEngineer = [];
		this.fileInputEl.nativeElement.value = "";

		this.cdr.markForCheck();
	}
	clearSelectionEngineer() {
		this.myFiles = [];
		this.images = [];
		this.fileInputEl.nativeElement.value = "";

		this.cdr.markForCheck();
	}

}
