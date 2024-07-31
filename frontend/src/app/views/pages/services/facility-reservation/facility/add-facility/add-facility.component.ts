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
import moment from 'moment';


@Component({
	selector: 'kt-add-facility',
	templateUrl: './add-facility.component.html',
	styleUrls: ['./add-facility.component.scss']
})
export class AddFacilityComponent implements OnInit, OnDestroy {
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
	facilityResult: any[] = []; // save data facility from master

	isActiveArr: any[] = [{ name: "Aktif", value: true }, { name: "Tidak Aktif", value: false }]
	minDate = new Date();

	isReservationDate: boolean = false // Enable input form *if choose reservation date
	isChooseTime: boolean = false // Enable Choose Time

	unitForm = new FormControl()
	facilityFormChoosed = new FormControl()
	timeForm = new FormControl()

	condGenerateCode: boolean = false;
	errorCond: boolean = false;
	errorCondQuota: boolean = false;

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
				this.store.pipe(select(selectFacilityById(id))).subscribe(res => {
					if (res) {
						this.facility = res;
						this.oldFacility = Object.assign({}, this.facility);
						this.initFacility();
					}
				});
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
		this.facilityForm = this.facilityFB.group({
			// Facility Reservation
			reservationDate: [{ value: "", disabled: false }, Validators.required],
			customer: [{ value: "", disabled: false }, Validators.required],
			customerName: [{ value: "", disabled: false }, Validators.required],
			phone: [{ value: "", disabled: false }, Validators.required],
			unit: [{ value: "", disabled: false }, Validators.required],
			// codeReservation: [{ value: "", disabled: false }, Validators.required],
			codeReservation: [{ value: '', disabled: false }, Validators.required], //Testing
			// ============== sec 2 ============== //
			facilityID: [{ value: "", disabled: false }, Validators.required],
			people_qty: [{ value: "", disabled: false }, Validators.required],
			reservationTime: [{ value: "", disabled: false }, Validators.required],
			maxPeople: [{ value: "", disabled: false }],
			status: [{ value: "open", disabled: false }, Validators.required],
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

	// Load List Unit Choose Faciliity
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
	unitOnChange(id: string) {
		const controls = this.facilityForm.controls
		controls.unit.setValue(id)
		controls.customer.setValue("")
		controls.customerName.setValue("")
		controls.phone.setValue("")

		this.service.getTenantInformation(id).subscribe(
			res => {
				if (res.status === 200) {
					controls.customer.setValue(res.data.cstmr._id)
					controls.customerName.setValue((res.data.contact_name).toUpperCase())
					controls.phone.setValue(res.data.contact_phone)
				}
			},
			err => {
				console.error(err);
				const controls = this.facilityForm.controls
				controls.customer.setValue("")
				controls.customerName.setValue("")
				controls.phone.setValue("")
				const message = 'Error while get data customer in unit!'
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				return
			}
		);
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
	async facilityOnChange(id: string, data) {
		try {
			const controls = this.facilityForm.controls
			controls.facilityID.setValue(data.facilityID)
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
		if (data.remainingQuota === 0) controls.maxPeople.setValue(data.remainingQuota)

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
		let text = event.target.value
		this._filterFacility(text)
	}

	_filterFacility(text: string) {
		this.facilityResultFiltered = this.facilityResult.filter((i) => {
			const filterText = `${i.facilityID.name.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}

	// Generate code Facility Reservation
	generateCode() {
		const controls = this.facilityForm.controls
		if (!this.condGenerateCode) {
			this.service.generateCodeFacility().subscribe(
				res => {
					controls.codeReservation.setValue(res.data)
					this.condGenerateCode = true
					this.cd.markForCheck()
				},
				err => {
					console.error(err);
				}
			)
		}
	}


	// Control date reservation (Function)
	async reservationDatePicker(e) {
		try {
			const controls = this.facilityForm.controls

			// Clear value is choose date (start)
			controls.unit.setValue("")
			this.unitForm.setValue(undefined)
			this.facilityFormChoosed.setValue(undefined)
			this.timeForm.setValue(undefined)
			controls.customer.setValue("")
			controls.customerName.setValue("")
			controls.phone.setValue("")
			controls.facilityID.setValue("")
			controls.people_qty.setValue("")
			controls.reservationTime.setValue("")
			controls.maxPeople.setValue("")
			// Clear value is choose date (end)

			// SetValue generateCode
			this.generateCode()

			controls.reservationDate.setValue(e.target.value)

			let dateValue = moment(e.target.value).format("YYYY/MM/DD");
			this.dateReservationValue.setValue(dateValue)
			await this.service.getDateFacility(dateValue).subscribe( // filter berdasarkan tanggal yang dipilih untuk menentukan data per waktu
				res => {
					if (!res.data.length) {
						this.isChooseTime = true
						const message = 'Tidak ada jadwal dari fasilitas yang dipilih!'
						this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
						this.cd.markForCheck()
						return
					}
					this.facilityResult = res.data
					this.facilityResultFiltered = res.data.slice()
					this.isReservationDate = true
					this.cd.markForCheck()
					this.loadFaciltyMaster("")
				},
				err => {
					console.error(err);
					this.isReservationDate = false
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

		if (controls.people_qty.value > this.isMaksOrderNumber) return this.errorCond = true
		if (controls.people_qty.value > controls.maxPeople.value) return this.errorCondQuota = true

		this.loading = true;
		const editedFacility = this.prepareFacility();
		this.addFacility(editedFacility, withBack);
	}

	prepareFacility(): FacilityModelFacility {
		const controls = this.facilityForm.controls;
		const _facilityFacility = new FacilityModelFacility()


		_facilityFacility.unit = controls.unit.value
		_facilityFacility.customer = controls.customer.value
		_facilityFacility.phone = controls.phone.value
		_facilityFacility.reservationDate = controls.reservationDate.value
		_facilityFacility.facilityID = controls.facilityID.value
		_facilityFacility.status = controls.status.value
		_facilityFacility.people_qty = controls.people_qty.value
		_facilityFacility.reservationTime = controls.reservationTime.value
		_facilityFacility.codeReservation = controls.codeReservation.value

		return _facilityFacility;
	}

	addFacility(_facility, withBack: boolean = false) {
		const addSubscription = this.service.createFacilityReservation(_facility).subscribe(
			res => {
				const message = `New facility successfully has been added.`;
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
		let result = 'Buat Informasi Reservasi Fasilitas';
		return result;
	}

	onAlertClose($event, stts: string) {
		if (stts === 'cond') this.errorCond = false;
		else if (stts === 'condQuota') this.errorCondQuota = false;
		else this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
