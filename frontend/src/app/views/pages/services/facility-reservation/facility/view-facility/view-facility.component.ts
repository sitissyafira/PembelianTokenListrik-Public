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
	selector: 'kt-view-facility',
	templateUrl: './view-facility.component.html',
	styleUrls: ['./view-facility.component.scss']
})
export class ViewFacilityComponent implements OnInit, OnDestroy {
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

	isActiveArr: any[] = [{ name: "Open", value: 'open' }, { name: "Closed", value: 'closed' }]

	isReservationDate: boolean = false // Enable input form *if choose reservation date
	isChooseTime: boolean = false // Enable Choose Time

	timeList: any[] = [{
		time_index: 1,
		startTime: "",
		endTime: "",
		quota: 0,
	}];


	dateReservationValue = new FormControl()

	loading: boolean = false;
	selection = new SelectionModel<FacilityModelFacility>(true, []);

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
	}

	createForm() {
		const startTime = this.facility.reservationTime.startTime
		const endTime = this.facility.reservationTime.startTime
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

	getComponentTitle() {
		let result = 'Lihat Informasi Reservasi Fasilitas';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
