import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
import { FacilityModelFacility } from "../../../../../../core/services/facility-reservation/facility/facility.model";
import {
	selectLastCreatedFacilityId,
	selectFacilityActionLoading,
	selectFacilityById
} from "../../../../../../core/services/facility-reservation/facility/facility.selector";
import { FacilityService } from '../../../../../../core/services/facility-reservation/facility/facility.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTable } from '@angular/material';
import moment from 'moment'
import { ModuleFacility } from '../../../../../../core/services/facility-reservation/facility/module/moduleservice';


@Component({
	selector: 'kt-edit-facility',
	templateUrl: './edit-facility.component.html',
	styleUrls: ['./edit-facility.component.scss']
})
export class EditFacilityComponent implements OnInit, OnDestroy {
	@ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;

	// Public properties
	type;
	datauser = localStorage.getItem("user");
	facility: any = FacilityModelFacility;
	FacilityId$: Observable<string>;
	oldFacility: FacilityModelFacility;
	selectedTab = 0;
	loading$: Observable<boolean>;
	facilityForm: FormGroup;
	hasFormErrors = false;
	unitResultFiltered: any[] = []; // save data unit get all
	timeResultFiltered: any[] = []; // save data time get all
	facilityResultFiltered: any[] = []; // save data facility from master

	days: any[] = [{ name: 'senin' }, { name: 'selasa' }, { name: 'rabu' }, { name: 'kamis' }, { name: 'jumat' }, { name: 'sabtu' }, { name: 'minggu' }]
	isActiveArr: any[] = [{ name: "Open", value: 'open' }, { name: "Closed", value: 'closed' }]

	isReservationDate: boolean = false // Enable input form *if choose reservation date
	isChooseTime: boolean = false // Enable Choose Time

	timeList: any[] = [{
		time_index: 1,
		startTime: "",
		endTime: "",
		quota: 0,
	}];

	isActivebBtnSave: boolean = false // To Actove or Disable btn save add facility
	facilityAddForm = new FormControl()
	reservationDate = new FormControl()

	dateReservationValue = new FormControl()

	loading: boolean = false;
	selection = new SelectionModel<FacilityModelFacility>(true, []);

	isMaksOrder: boolean = false // condtion if facility choosed and get maks people
	isMaksOrderNumber: number = 0 // condtion if facility choosed and get maks people

	date = new Date();
	// time = new FormControl(this.date.getHours() + ":" + this.date.getMinutes())
	time = moment(new Date()).format('LT');
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private moduleFacility: ModuleFacility,  // services for flow facility systems (ex: changeStatus > to change status, etc.)
		private router: Router,
		private facilityFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: FacilityService,
		private layoutConfigService: LayoutConfigService,
		private cd: ChangeDetectorRef

	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectFacilityActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.service.getByIdFacilityReservation(id).subscribe(res => {
					this.facility = res.data;
					this.initFacility();
				})
			} else {
				this.facility = new FacilityModelFacility();
				this.facility.clear();
				this.initFacility();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	initFacility() {
		this.createForm();
		this.loadUnit("")
	}

	createForm() {
		const startTime = this.facility.reservationTime.startTime
		const endTime = this.facility.reservationTime.endTime
		const time_index = this.facility.reservationTime.time_index
		const resultReservationTime = `Waktu ${time_index} ( ${startTime} - ${endTime} )`

		this.facilityForm = this.facilityFB.group({
			// Facility Reservation
			tglReservation: [{ value: moment(this.facility.reservationDate).format('MM/DD/YYYY'), disabled: false }, Validators.required],
			reservationDate: [{ value: this.facility.reservationDate, disabled: false }, Validators.required],
			customer: [{ value: this.facility.customer._id, disabled: false }, Validators.required],
			customerName: [{ value: this.facility.customer ? this.facility.customer.cstrmrnm : '', disabled: false }, Validators.required],
			phone: [{ value: this.facility.phone, disabled: false }, Validators.required],
			unitName: [{ value: this.facility.unit.cdunt, disabled: false }, Validators.required],
			unit: [{ value: this.facility.unit._id, disabled: false }, Validators.required],
			codeReservation: [{ value: this.facility.codeReservation, disabled: false }, Validators.required],
			// ============== sec 2 ============== //
			facilityName: [{ value: this.facility.facilityID ? this.facility.facilityID.name : "", disabled: false }, Validators.required],
			facilityID: [{ value: this.facility.facilityID ? this.facility.facilityID._id : "", disabled: false }, Validators.required],
			people_qty: [{ value: this.facility.people_qty, disabled: false }, Validators.required],
			reservationTimeName: [{ value: this.facility.reservationTime ? resultReservationTime : '', disabled: false }, Validators.required],
			reservationTime: [{ value: this.facility.reservationTime, disabled: false }, Validators.required],
			maxPeople: [{ value: this.facility.maxPeople, disabled: false }],
			status: [{ value: this.facility.status, disabled: false }, Validators.required],
		});
	}



	goBackWithId() {
		const url = `/facility-reservation`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshFacility(isNew: boolean = false, id: string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/facility/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	// Load List Facility Choose Faciliity
	async loadUnit(text) {
		try {
			this.selection.clear();
			const queryParams = text
			await this.service.getUnitFacility(queryParams).subscribe(
				res => {
					this.unitResultFiltered = res.data
					this.cd.markForCheck()
				}
			);
		} catch (error) {
			console.error(error);
		}
	}

	// Load List Facility Choose Faciliity
	async loadFaciltyMaster(text) {
		try {
			// this.selection.clear();
			// const queryParams = text
			// await this.service.getUnitFacility(queryParams).subscribe(
			// 	res => {
			// 		this.unitResultFiltered = res.data
			// 		this.cd.markForCheck()
			// 	}
			// );
		} catch (error) {
			// console.error(error);
		}
	}

	// Klik Fasilitas Reservasi
	async unitOnChange(id: string) {
		try {
			const controls = this.facilityForm.controls
			controls.unit.setValue(id)

			await this.service.getTenantInformation(id).subscribe(
				res => {
					controls.customer.setValue(res.data.cstmr._id)
					controls.customerName.setValue((res.data.contact_name).toUpperCase())
					controls.phone.setValue(res.data.contact_phone)
					this.cd.markForCheck()
				}
			);
		} catch (error) {
			console.error(error);
		}
	}

	// KeyUp Pilih Unit Reservasi
	_onKeyupUnit(event) {
		this.loadUnit(event.target.value)
	}

	// KeyUp Pilih Time Reservasi
	_onKeyupTime(event) {
		// this.loadUnit(event.target.value)
	}


	// Klik Fasilitas Reservasi
	async facilityOnChange(id: string) {
		try {
			const controls = this.facilityForm.controls
			controls.facilityID.setValue(id)
			const queryParams = {
				filter: {
					scheduleId: id,
					reservationDate: this.dateReservationValue.value
				}
			}

			await this.service.getTimeReservation(queryParams).subscribe(
				res => {
					this.isMaksOrderNumber = res.data.maxPeople
					if (res.data.scheduleDetail.length) {
						this.timeResultFiltered = res.data.scheduleDetail
						this.isChooseTime = true
						this.isMaksOrder = true
					} else {
						const message = 'Tidak ada jadwal waktu dari fasilitas yang dipilih!'
						this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
						return
					}
					this.cd.markForCheck()
				}
			);
		} catch (error) {
			console.error(error);
		}
	}
	// Klik Fasilitas Reservasi
	timeOnChange(data) {
		const controls = this.facilityForm.controls
		if (data.remainingQuota) controls.maxPeople.setValue(data.remainingQuota)

		const result = {
			time_index: data.time_index,
			startTime: data.startTime,
			endTime: data.endTime,
			quota: data.quota,
		}
		controls.reservationTime.setValue(result)
	}

	// KeyUp Pilih Fasilitasi Reservasi
	_onKeyupFacility(event) {
		this.loadFaciltyMaster(event.target.value)
	}
	// Change value to input data in variabel arr (timeList)
	changeValue(id, property, event) {
		if (property === 'quota') this.timeList[id][property] = parseInt(event.target.value);
		else this.timeList[id][property] = event

		this.cd.markForCheck()
	}


	// Control date reservation (Function)
	async reservationDatePicker(e) {
		try {
			const controls = this.facilityForm.controls

			controls.reservationDate.setValue(e.target.value)

			let dateValue = moment(e.target.value).format("YYYY/MM/DD");
			this.dateReservationValue.setValue(dateValue)
			await this.service.getDateFacility(dateValue).subscribe( // filter berdasarkan tanggal yang dipilih untuk menentukan data per waktu
				res => {
					this.facilityResultFiltered = res.data
					this.isReservationDate = true
					this.loadFaciltyMaster("")
					this.cd.markForCheck()
				},
				err => {
					console.error(err);
				}
			)
		} catch (error) {
			console.error(error);
		}
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.facilityForm.controls;
		/** check form */
		if (this.facilityForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		this.loading = true;
		const editedFacility = this.prepareFacility();
		this.updateFacility(editedFacility, withBack);
	}

	prepareFacility(): FacilityModelFacility {
		const controls = this.facilityForm.controls;
		const _facilityFacility = new FacilityModelFacility()


		_facilityFacility.unit = controls.unit.value
		_facilityFacility.customer = controls.customer.value
		_facilityFacility.phone = controls.phone.value
		_facilityFacility.reservationDate = controls.reservationDate.value
		_facilityFacility.facilityID = controls.facilityID.value
		/* Update status condition (Status updates are in the facility module for the facility system flow) */
		_facilityFacility.status = this.moduleFacility.flowStatusFacility(controls.status.value)

		_facilityFacility.people_qty = controls.people_qty.value
		_facilityFacility.reservationTime = controls.reservationTime.value
		_facilityFacility.codeReservation = controls.codeReservation.value

		return _facilityFacility;
	}

	updateFacility(_facility, withBack: boolean = false) {
		const addSubscription = this.service.updateFacilityReservation(this.facility._id, _facility).subscribe(
			res => {
				const message = `Update facility successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/facility-reservation`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				if (err.status === 409) {
					const message = err.error.data
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				} else {
					const message = 'Error while adding facility facility | ' + err.statusText;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				}
			}
		);
		this.subscriptions.push(addSubscription);
		this.loading = false
	}

	getComponentTitle() {
		let result = 'Edit Informasi Reservasi Fasilitas';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
