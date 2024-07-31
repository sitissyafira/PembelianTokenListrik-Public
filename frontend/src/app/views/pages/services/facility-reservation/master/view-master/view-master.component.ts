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
import { FacilityModelMaster } from "../../../../../../core/services/facility-reservation/master/master.model";
import {
	selectLastCreatedMasterId,
	selectMasterActionLoading,
	selectMasterById
} from "../../../../../../core/services/facility-reservation/master/master.selector";
import { MasterService } from '../../../../../../core/services/facility-reservation/master/master.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTable } from '@angular/material';
import moment from 'moment';


@Component({
	selector: 'kt-view-master',
	templateUrl: './view-master.component.html',
	styleUrls: ['./view-master.component.scss']
})
export class ViewMasterComponent implements OnInit, OnDestroy {
	@ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;

	// Public properties
	type;
	datauser = localStorage.getItem("user");
	master: any = FacilityModelMaster;
	MasterId$: Observable<string>;
	oldMaster: FacilityModelMaster;
	selectedTab = 0;
	loading$: Observable<boolean>;
	masterForm: FormGroup;
	hasFormErrors = false;
	masterResultFiltered: any[] = [];

	days: any[] = [{ name: 'senin' }, { name: 'selasa' }, { name: 'rabu' }, { name: 'kamis' }, { name: 'jumat' }, { name: 'sabtu' }, { name: 'minggu' }]
	isActiveArr: any[] = [{ name: "Aktif", value: true }, { name: "Tidak Aktif", value: false }]

	dataRemove: any = { _id: "", name: "" } // Remove master by ID
	dataAdded: any = { _id: "", name: "" } // Add master by ID

	timeList: any[] = [{
		time_index: 1,
		startTime: "",
		endTime: "",
		quota: 0,
	}];

	isActivebBtnSave: boolean = false // To Actove or Disable btn save add master
	facilityForm = new FormControl()

	loading: boolean = false;
	selection = new SelectionModel<FacilityModelMaster>(true, []);


	@ViewChild('myTable', { static: false }) table: MatTable<any>;
	displayedColumns = ['no', 'start', 'end', 'quota', 'action'];


	date = new Date();
	// time = new FormControl(this.date.getHours() + ":" + this.date.getMinutes())
	time = moment(new Date()).format('LT');
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private masterFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: MasterService,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog,
		private cd: ChangeDetectorRef

	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectMasterActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.service.getByIdMaster(id).subscribe(res => {
					if (res) {
						this.master = res.data
						this.timeList = res.data.scheduleDetail
						this.initMaster();
					}
				})
			} else {
				this.master = new FacilityModelMaster();
				this.master.clear();
				this.initMaster();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	initMaster() {
		this.createForm();
	}

	createForm() {
		this.masterForm = this.masterFB.group({
			facilityID: [{ value: this.master.facilityID._id, disabled: false }, Validators.required],
			facilityName: [{ value: this.master.facilityID.name, disabled: false }],
			masterName: [{ value: this.master.facilityID.name, disabled: false }],
			scheduleDay: [{ value: this.master.scheduleDay ? (this.master.scheduleDay).toLowerCase() : '', disabled: true }, Validators.required],
			hourBeforeStartTime: [{ value: this.master.hourBeforeStartTime ? this.master.hourBeforeStartTime : '', disabled: false }],

			// Detail Reservation
			isActive: [{ value: this.master.isActive, disabled: true }, Validators.required],
			maxPeople: [{ value: this.master.maxPeople, disabled: false }, Validators.required],
		});

	}



	goBackWithId() {
		const url = `/master-facility-reservation`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshMaster(isNew: boolean = false, id: string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/master/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	getComponentTitle() {
		let result = 'Lihat Jadwal Reservasi Fasilitas';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
