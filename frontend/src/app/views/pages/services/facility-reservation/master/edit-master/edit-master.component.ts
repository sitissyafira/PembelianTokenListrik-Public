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
	selector: 'kt-edit-master',
	templateUrl: './edit-master.component.html',
	styleUrls: ['./edit-master.component.scss']
})
export class EditMasterComponent implements OnInit, OnDestroy {
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
			scheduleDay: [{ value: this.master.scheduleDay ? (this.master.scheduleDay).toLowerCase() : '', disabled: false }, Validators.required],
			hourBeforeStartTime: [{ value: this.master.hourBeforeStartTime ? this.master.hourBeforeStartTime : '', disabled: false }],

			// Detail Reservation
			isActive: [{ value: this.master.isActive, disabled: false }, Validators.required],
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

	// Multi time function (Add Time)
	addTime(id) {
		let findList = this.timeList[id] // get Time List by index
		let findListLastIndex = this.timeList.length > 1 ? this.timeList[id - 1] : '' // get Time List by last index
		let startTime = parseFloat(findList.startTime)
		let endTime = parseFloat(findList.endTime)


		if (findListLastIndex) {
			if (startTime < parseFloat(findListLastIndex.endTime)) {
				const messageLarger = 'Waktu mulai tidak bisa lebih kecil dari waktu akhir sebelumnya'
				this.layoutUtilsService.showActionNotification(messageLarger, MessageType.Create, 5000, true, false);
				return
			}
		}

		if (!findList.startTime || !findList.endTime || !findList.quota) {
			const message = 'Lengkapi waktu mulai, waktu akhir dan kuota!'
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			return
		}

		if (startTime > endTime) {
			const messageLarger = 'Waktu akhir tidak bisa lebih kecil dari waktu mulai!'
			this.layoutUtilsService.showActionNotification(messageLarger, MessageType.Create, 5000, true, false);
			return
		}

		this.timeList.push({ time_index: (id + 2), startTime: "", endTime: "", quota: "" });
		this.table.renderRows();
	}

	// Change value to input data in variabel arr (timeList)
	changeValue(id, property, event) {
		if (property === 'quota') this.timeList[id][property] = parseInt(event.target.value);
		else this.timeList[id][property] = event

		this.cd.markForCheck()
	}



	// Multi time function (Remove Time)
	removeTime(i: number) {
		this.timeList.splice(i, 1);
		this.table.renderRows();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.masterForm.controls;
		/** check form */
		if (this.masterForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const lastIndexListTime = this.timeList[this.timeList.length - 1] // Find Last Data in List Time to validate input

		const findListLastIndex = this.timeList.length > 1 ? this.timeList[this.timeList.length - 2] : ''

		if (findListLastIndex) {
			if (parseFloat(lastIndexListTime.startTime) < parseFloat(findListLastIndex.endTime)) {
				const messageLarger = 'Waktu mulai tidak bisa lebih kecil dari waktu akhir sebelumnya'
				this.layoutUtilsService.showActionNotification(messageLarger, MessageType.Create, 5000, true, false);
				return
			}
		}

		if (!lastIndexListTime.startTime || !lastIndexListTime.endTime || !lastIndexListTime.quota) {
			const message = 'Lengkapi waktu mulai, waktu akhir dan kuota!'
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			return
		}


		if (parseFloat(lastIndexListTime.startTime) > parseFloat(lastIndexListTime.endTime)) { // Find Last Data in List Time to validate input
			const messageLarger = 'Waktu akhir tidak bisa lebih kecil dari waktu mulai!'
			this.layoutUtilsService.showActionNotification(messageLarger, MessageType.Create, 5000, true, false);
			return
		}


		this.loading = true;
		const editedMaster = this.prepareMaster();
		this.updateMaster(editedMaster, withBack);
	}

	// Trigerred change input to active btn save
	changeNewMaster(event) {
		if (event.target.value) this.isActivebBtnSave = true;
		else this.isActivebBtnSave = false
	}


	prepareMaster(): FacilityModelMaster {
		const controls = this.masterForm.controls;
		const _masterMaster = new FacilityModelMaster()

		_masterMaster._id = this.master._id
		_masterMaster.facilityID = controls.facilityID.value

		_masterMaster.scheduleDay = controls.scheduleDay.value
		_masterMaster.hourBeforeStartTime = controls.hourBeforeStartTime.value

		// Detail Master Time
		_masterMaster.scheduleDetail = this.timeList

		_masterMaster.maxPeople = controls.maxPeople.value
		_masterMaster.isActive = controls.isActive.value

		return _masterMaster;
	}

	updateMaster(_master, withBack: boolean = false) {
		const addSubscription = this.service.updateMasterMaster(_master).subscribe(
			res => {
				const message = `New master master successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/master-facility-reservation`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				if (err.status === 409) {
					const message = err.error.data
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				} else {
					const message = 'Error while adding master master | ' + err.statusText;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				}
			}
		);
		this.subscriptions.push(addSubscription);
		this.loading = false
	}

	getComponentTitle() {
		let result = 'Edit Jadwal Reservasi Fasilitas';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}