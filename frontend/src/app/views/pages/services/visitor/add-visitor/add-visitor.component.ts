import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { VisitorModel } from "../../../../../core/services/visitor/visitor.model";
import {
	selectLastCreatedVisitorId,
	selectVisitorActionLoading,
	selectVisitorById
} from "../../../../../core/services/visitor/visitor.selector";
import { VisitorService } from '../../../../../core/services/visitor/visitor.service';
import { QueryOwnerTransactionModel } from '../../../../../core/contract/ownership/queryowner.model';
import { SelectionModel } from '@angular/cdk/collections';
import { UnitService } from '../../../../../core/unit/unit.service';
import { OwnershipContractService } from '../../../../../core/contract/ownership/ownership.service';
import { LeaseContractService } from '../../../../../core/contract/lease/lease.service';
import moment from 'moment';


@Component({
	selector: 'kt-add-visitor',
	templateUrl: './add-visitor.component.html',
	styleUrls: ['./add-visitor.component.scss']
})
export class AddVisitorComponent implements OnInit, OnDestroy {
	// Public properties
	type;
	datauser = localStorage.getItem("user");
	visitor: VisitorModel;
	VisitorId$: Observable<string>;
	oldVisitor: VisitorModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	visitorForm: FormGroup;
	hasFormErrors = false;
	unitResult: any[] = [];
	cityResult: any[] = [];
	loading: boolean = false;
	selection = new SelectionModel<VisitorModel>(true, []);
	date1 = moment(new Date()).format('L');
	dateTime = new FormControl(new Date());
	date = new Date();
	time = new FormControl(this.date.getHours() + ":" + this.date.getMinutes())

	checkinDateForm = {
		checkin_date: moment(new Date()).format('L'),
		// checkin_time: new FormControl(this.date.getHours() + ":" + this.date.getMinutes())
		checkin_time: new FormControl(moment(new Date()).format("HH:mm"))
	}

	openLainnya: boolean = false

	// Upload Image (new) START
	@ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;
	@ViewChild('fileInputVisitorPict', { static: false }) fileInputVisitorPictEl: ElementRef;

	images: any[] = []
	myFiles: any[] = []

	imagesVisitorPict: any[] = []
	myFilesVisitorPict: any[] = []

	// Upload Image (new) END

	checker: boolean = false

	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visitorFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: VisitorService,
		private serviceUnit: UnitService,
		private ownService: OwnershipContractService,
		private leaseService: LeaseContractService,
		private layoutConfigService: LayoutConfigService,
		private cd: ChangeDetectorRef

	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectVisitorActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectVisitorById(id))).subscribe(res => {
					if (res) {
						this.visitor = res;
						this.oldVisitor = Object.assign({}, this.visitor);
						this.initVisitor();
					}
				});
			} else {
				this.visitor = new VisitorModel();
				this.visitor.clear();
				this.initVisitor();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	initVisitor() {
		this.createForm();
		this.loadUnit("");
		this.loadCity("");
	}

	createForm() {
		this.visitorForm = this.visitorFB.group({

			// Flow Baru #START
			// Appointment Request #START
			unit: [{ value: "", disabled: false }, Validators.required],
			customerId: [{ value: "", disabled: false }],
			customerName: [{ value: "", disabled: false }, Validators.required],
			tanggal: [{ value: this.date1, disabled: false }, Validators.required],
			// jam: [{ value: this.time.value, disabled: false }, Validators.required],
			jam: [{ value: moment(new Date()).format("HH:mm"), disabled: false }, Validators.required],
			// Appointment Request #END

			// Check In #START
			checkIn: [{ value: new Date(), disabled: false }, Validators.required],
			checkIn_jam: [{ value: moment(new Date()).format("HH:mm"), disabled: false }, Validators.required],
			// Check In #END

			// Guest Information #START
			guestId: [{ value: "", disabled: false }, Validators.required],
			nama: [{ value: "", disabled: false }, Validators.required],
			jenisKelamin: [{ value: "", disabled: false }, Validators.required], // input type ( M = "MALE" , F = "FEMALE" )
			// company: [{ value: "", disabled: false }],
			// address: [{ value: "", disabled: false }, Validators.required],
			// city: [{ value: "", disabled: false }],
			guestQty: [{ value: "", disabled: false }, Validators.required],
			noTelp: [{ value: "", disabled: false }],
			idCardType: [{ value: "", disabled: false }],
			idCardNo: [{ value: "", disabled: false }],
			keperluan: [{ value: "", disabled: false }],
			// Guest Information #END

			// Tambahan
			isRead: [{ value: false, disabled: false }],
			statusVisitor: [{ value: "wait-confirm-mob", disabled: false }],
			// Flow Baru #END

			// Flow Lama
			remark: [{ value: "", disabled: false }],
			contract_name: [{ value: "", disabled: false }],
			createdBy: [this.datauser],
			createdDate: [{ value: this.dateTime.value, disabled: false }],
		});
	}

	// loadUnit() { // Flow Lama
	// 	this.selection.clear();
	// 	const queryParams = new QueryOwnerTransactionModel(
	// 		null,
	// 		"asc",
	// 		null,
	// 		1,
	// 		10
	// 	);
	// 	this.serviceUnit.getDataUnitForParking(queryParams).subscribe(
	// 		res => {
	// 			this.unitResult = res.data;
	// 		}
	// 	);
	// }

	loadUnit(text: string) { // Flow Baru
		this.selection.clear();
		const queryParams = text
		this.service.getUnit(queryParams).subscribe(
			res => {
				this.unitResult = res.data;
				this.cd.markForCheck()
			}
		);
	}

	loadCity(text: string) { // Flow Baru
		this.selection.clear();
		const queryParams = text
		this.service.getCity(queryParams).subscribe(
			res => {
				this.cityResult = res.data;
				this.cd.markForCheck()
			}
		);
	}

	searchUnit(event) {
		this.loadUnit(event.target.value)
	}

	searchCity(event) {
		this.loadCity(event.target.value)
	}

	// unitOnChange(id) { // Flow Lama
	// 	const controls = this.visitorForm.controls;
	// 	this.serviceUnit.getUnitById(id).subscribe(
	// 		data => {
	// 			this.type = data.data.type;

	// 			if (this.type == "owner" || this.type == "pp") {
	// 				this.ownService.findOwnershipContractByUnit(id).subscribe(
	// 					dataowner => {
	// 						this.visitorForm.controls.contract_name.setValue(dataowner.data[0].contact_name);
	// 					}
	// 				)
	// 			} else {
	// 				this.leaseService.findLeaseContractByUnit(id).subscribe(
	// 					datalease => {
	// 						this.visitorForm.controls.contract_name.setValue(datalease.data[0].contact_name);
	// 					}
	// 				)
	// 			}
	// 		}
	// 	)
	// }

	unitOnChange(id) {
		const controls = this.visitorForm.controls;
		this.service.getCustomer(id).subscribe(
			res => {
				controls.unit.setValue(id)
				controls.customerId.setValue(res.data.cstmr._id)
				controls.customerName.setValue(res.data.cstmr.cstrmrnm)
			},
			err => {
				console.error(err);
				const message = `Error get customer!`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			}
		)
	}

	cityOnChange(id) {
		const controls = this.visitorForm.controls;
		controls.city.setValue(id)
	}


	goBackWithId() {
		const url = `/visitor`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshVisitor(isNew: boolean = false, id: string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/visitor/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}


	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.visitorForm.controls;

		// Condition Jika checker ID (true) #START
		if (this.checker) {
			if (!controls.idCardType.value || !controls.idCardNo.value) {
				const message = `Enter ID Card type or number!`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				return
			}
		}
		// Condition Jika checker ID (true) #END 

		/** check form */
		if (this.visitorForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		this.loading = true;
		const editedVisitor = this.prepareVisitor();
		this.addVisitor(editedVisitor, withBack);
	}


	prepareVisitor() {
		const controls = this.visitorForm.controls;
		// ( Flow lama)
		// const _visitor = new VisitorModel(); 
		// _visitor.clear();
		// _visitor._id = this.visitor._id;
		// _visitor.unit = controls.unit.value;

		// _visitor.nama = controls.nama.value.toLowerCase();
		// _visitor.jenisKelamin = controls.jenisKelamin.value;
		// _visitor.keperluan = controls.keperluan.value;
		// _visitor.tanggal = controls.tanggal.value;
		// _visitor.jam = controls.jam.value;
		// _visitor.remark = controls.remark.value;

		// _visitor.noTelp = controls.noTelp.value;
		// _visitor.createdBy = controls.createdBy.value;
		// _visitor.createdDate = controls.createdDate.value;

		// (Flow Baru)
		// # START
		// Appointment Request #START
		const formData = new FormData()
		formData.append("unit", controls.unit.value)
		formData.append("customerId", controls.customerId.value)
		formData.append("tanggal", controls.tanggal.value)
		formData.append("jam", controls.jam.value)
		// Appointment Request #END 

		// Check In #START
		formData.append("checkIn", controls.checkIn.value)
		formData.append("checkIn_jam", controls.checkIn_jam.value)
		// Check In #END 

		// Guest Information #START
		formData.append("guestId", controls.guestId.value)
		formData.append("nama", controls.nama.value)
		formData.append("jenisKelamin", controls.jenisKelamin.value)
		// formData.append("company", controls.company.value)
		// formData.append("address", controls.address.value)
		// if (controls.city.value) formData.append("city", controls.city.value)
		formData.append("guestQty", controls.guestQty.value)
		formData.append("noTelp", controls.noTelp.value)
		formData.append("idCardType", controls.idCardType.value)
		formData.append("idCardNo", controls.idCardNo.value)
		formData.append("keperluan", controls.keperluan.value)
		// Guest Information #END 

		// Tambahan #START
		formData.append("isRead", controls.isRead.value)
		formData.append("statusVisitor", controls.statusVisitor.value)

		// Attachment (start)
		for (let i = 0; i < this.myFiles.length; i++) {
			formData.append("attachment", this.myFiles[i]);
		}
		// Attachment (end)

		// visitorAttachment (start) # foto visitor
		for (let i = 0; i < this.myFilesVisitorPict.length; i++) {
			formData.append("visitorAttachment", this.myFilesVisitorPict[i]);
		}
		// visitorAttachment (end)

		// Tambahan #END 

		return formData;
	}

	addVisitor(_visitor, withBack: boolean = false) {
		const addSubscription = this.service.createVisitor(_visitor).subscribe(
			res => {
				const message = `New visitor successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/visitor`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding visitor | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	getComponentTitle() {
		// let result = 'Create Visitor';
		let result = 'Guest Appointment Requests';
		return result;
	}

	// Upload Image (new) START
	selectFileUpload(e, status) {
		if (status === 'visitorPict') {
			const filesVisitorPict = (e.target as HTMLInputElement).files;

			if (filesVisitorPict.length > 1 || this.myFilesVisitorPict.length >= 1 || this.imagesVisitorPict.length >= 1) {
				this.fileInputVisitorPictEl.nativeElement.value = "";
				const message = `Only 1 imagesVisitorPict are allowed to select`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);

				return
			}

			for (let i = 0; i < filesVisitorPict.length; i++) {
				// Skip uploading if file is already selected
				const alreadyIn = this.myFilesVisitorPict.filter(tFile => tFile.name === filesVisitorPict[i].name).length > 0;
				if (alreadyIn) continue;

				this.myFilesVisitorPict.push(filesVisitorPict[i]);

				const reader = new FileReader();
				reader.onload = () => {
					this.imagesVisitorPict.push({ name: filesVisitorPict[i].name, url: reader.result });
					this.cd.markForCheck();
				}
				reader.readAsDataURL(filesVisitorPict[i]);
			}
		} else {
			const files = (e.target as HTMLInputElement).files;

			if (files.length > 1 || this.myFiles.length >= 1 || this.images.length >= 1) {
				this.fileInputEl.nativeElement.value = "";
				const message = `Only 1 images are allowed to select`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);

				return
			}

			for (let i = 0; i < files.length; i++) {
				// Skip uploading if file is already selected
				const alreadyIn = this.myFiles.filter(tFile => tFile.name === files[i].name).length > 0;
				if (alreadyIn) continue;

				this.myFiles.push(files[i]);

				const reader = new FileReader();
				reader.onload = () => {
					this.images.push({ name: files[i].name, url: reader.result });
					this.cd.markForCheck();
				}
				reader.readAsDataURL(files[i]);
			}
		}
	}

	clearSelection(status) {
		if (status === "visitorPict") {
			this.myFilesVisitorPict = [];
			this.imagesVisitorPict = [];
			this.fileInputVisitorPictEl.nativeElement.value = "";
		} else {
			this.myFiles = [];
			this.images = [];
			this.fileInputEl.nativeElement.value = "";
		}
		this.cd.markForCheck();
	}

	removeSelectedFile(item) {
		if (status === 'visitorPict') {
			this.myFilesVisitorPict = this.myFilesVisitorPict.filter(i => i.name !== item.name);
			this.imagesVisitorPict = this.imagesVisitorPict.filter(i => i.url !== item.url);
			this.fileInputVisitorPictEl.nativeElement.value = "";
		} else {
			this.myFiles = this.myFiles.filter(i => i.name !== item.name);
			this.images = this.images.filter(i => i.url !== item.url);
			this.fileInputEl.nativeElement.value = "";
		}

		this.cd.markForCheck();
	}
	// Upload Image (new) END 

	checkinDatePicker(event) {
		const time = moment(new Date()).format("HH:mm");
		this.checkinDateForm.checkin_time.setValue(time)

		// Set Value To Form #START
		const controls = this.visitorForm.controls
		controls.checkIn.setValue(event.value)
		controls.checkIn_jam.setValue(time)
		// Set Value To Form #END
	}

	clickLainnya(stts) {
		if (stts) this.openLainnya = true;
		else this.openLainnya = false;
	}

	showOptions(e) {
		const controls = this.visitorForm.controls
		if (e.checked) this.checker = true;
		else {
			this.checker = false;
			this.myFiles = []
			this.images = []
			controls.idCardType.setValue("")
			controls.idCardNo.setValue("")
		}
	}


	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
