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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ModuleVisitor } from '../../../../../core/services/visitor/module/moduleservice';


@Component({
	selector: 'kt-edit-visitor',
	templateUrl: './edit-visitor.component.html',
	styleUrls: ['./edit-visitor.component.scss']
})
export class EditVisitorComponent implements OnInit, OnDestroy {
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
	cityResult: any[] = [];
	unitResult: any[] = [];
	loading: boolean = false;
	selection = new SelectionModel<VisitorModel>(true, []);
	date1 = new FormControl(new Date());

	openLainnya: boolean = false

	checker: boolean = false
	date = new Date();

	checkinDateForm: any = {
		checkin_date: moment(new Date()).format('L'),
		checkin_time: new FormControl(this.date.getHours() + ":" + this.date.getMinutes())
	}

	// Upload Image (new) START
	@ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;
	@ViewChild('fileInputVisitorPict', { static: false }) fileInputVisitorPictEl: ElementRef;

	images: any[] = []
	myFiles: any[] = []
	imagesVisitorPict: any[] = []
	myFilesVisitorPict: any[] = []

	// Upload Image (new) END


	loadingForm: boolean = false



	// Check data checkout START
	loadCheckOut: boolean = false
	formCheckOut = {
		checkOut: new FormControl(),
		checkOut_jam: new FormControl(),
		checkOutDateValue: new FormControl(),
	}
	// Check data checkout END

	idVisitor: string = ""

	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private moduleVisitor: ModuleVisitor, // services for flow visitor systems (ex: changeStatus > to change status, etc.)
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
		private dialog: MatDialog,
		private cd: ChangeDetectorRef

	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectVisitorActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.idVisitor = id
				// this.store.pipe(select(selectVisitorById(id))).subscribe(res => {
				this.service.findVisitorById(id).subscribe(res => {
					if (res) {
						this.service.updateIsRead(id).subscribe(res)
						this.visitor = res.data;
						this.initVisitor()
						if (res.data.checkOut && res.data.checkOut_jam) {
							this.loadCheckOut = true
							this.formCheckOut.checkOut.setValue(moment(res.data.checkOut).format('L'))
							this.formCheckOut.checkOut_jam.setValue(res.data.checkOut_jam)
						}
						if (res.data.idCardNo && res.data.idCardType) this.checker = true
						if (res.data.idCardType === "lainnya") this.openLainnya = true

						// Check In Value Jika ada datanya START
						this.checkinDateForm.checkin_date = this.visitor.checkIn ? moment(this.visitor.checkIn).format('L') : ""
						this.checkinDateForm.checkin_time = this.visitor.checkIn_jam ? this.visitor.checkIn_jam : ""
						// Check In Value Jika ada datanya END
					}
				});
			}

			else {
				this.visitor = new VisitorModel();
				this.visitor.clear();
				this.initVisitor();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	initVisitor() {
		if (this.visitor.attachment) this.images.push(this.visitor.attachment)
		if (this.visitor.visitorAttachment) this.imagesVisitorPict.push(this.visitor.visitorAttachment)
		this.createForm();
		this.loadCity("")
	}

	createForm() {
		this.visitorForm = this.visitorFB.group({

			// Flow Baru #START
			// Appointment Request #START
			unit: [{ value: this.visitor.unit._id, disabled: false }],
			unitName: [{ value: this.visitor.unit.cdunt, disabled: false }],
			customerId: [{ value: this.visitor.customerId._id, disabled: false }],
			customerName: [{ value: this.visitor.customerId.cstrmrnm, disabled: false }],
			tanggal: [{ value: moment(this.visitor.tanggal).format('L'), disabled: false }],
			jam: [{ value: this.visitor.jam, disabled: false }],
			// Appointment Request #END

			// Check In #START
			checkIn: [{ value: this.visitor.checkIn ? moment(this.visitor.checkIn).format('L') : "", disabled: false }],
			checkIn_jam: [{ value: this.visitor.checkIn_jam ? this.visitor.checkIn_jam : "", disabled: false }],
			// Check In #END

			// Guest Information #START
			guestId: [{ value: this.visitor.guestId, disabled: false }, Validators.required],
			nama: [{ value: this.visitor.nama, disabled: false }],
			jenisKelamin: [{ value: this.visitor.jenisKelamin, disabled: true }], // input type ( M = "MALE" , F = "FEMALE" )
			// company: [{ value: this.visitor.company, disabled: false }],
			// address: [{ value: this.visitor.address, disabled: false }, Validators.required],
			// city: [{ value: this.visitor.city ? this.visitor.city.name : "", disabled: false }],
			guestQty: [{ value: this.visitor.guestQty, disabled: false }],
			noTelp: [{ value: this.visitor.noTelp, disabled: false }],
			idCardType: [{ value: this.visitor.idCardType, disabled: false }],
			idCardNo: [{ value: this.visitor.idCardNo, disabled: false }],
			keperluan: [{ value: this.visitor.keperluan, disabled: false }],
			// Guest Information #END

			// Tambahan
			isRead: [{ value: false, disabled: false }],
			statusVisitor: [{ value: this.visitor.statusVisitor, disabled: false }],
			// Flow Baru #END

			// Flow Lama
			remark: [{ value: this.visitor.remark ? this.visitor.remark : "", disabled: false }],
			contract_name: [{ value: this.visitor.contract_name ? this.visitor.contract_name : "", disabled: false }],
			createdBy: [{ value: this.visitor.createdBy._id }],
			// createdDate: [{ value: this.visitor.createdDate, disabled: false }],
		});

		this.loadingForm = true
		this.cd.markForCheck()
	}

	loadUnit() {
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(
			null,
			"asc",
			null,
			1,
			10
		);
		this.serviceUnit.getDataUnitForParking(queryParams).subscribe(
			res => {
				this.unitResult = res.data;
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

	searchCity(event) {
		this.loadCity(event.target.value)
	}

	cityOnChange(id) {
		const controls = this.visitorForm.controls;
		controls.city.setValue(id)
	}

	// unitOnChange(id) {
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


	onSubmit(withBack: boolean = false, statusVisitor: string, button: string) {
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

		if (statusVisitor === 'check-in') {
			if (!this.formCheckOut.checkOut.value && !this.formCheckOut.checkOutDateValue.value) {
				const message = `Input check out date and time!`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);

				return
			}
		} else if (statusVisitor === 'approve-by-web') {
			if (button !== 'btnCancel') {
				if (!controls.checkIn.value && !controls.checkIn_jam.value) {
					const message = `Input check in date and time!`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
					return
				}
			}
		}

		/** check form */
		if (button !== 'btnCancel') {
			if (statusVisitor === 'approve-by-web') {
				if (this.visitorForm.invalid) {
					Object.keys(controls).forEach(controlName =>
						controls[controlName].markAsTouched()
					);

					this.hasFormErrors = true;
					this.selectedTab = 0;
					return;
				}
			}

		}

		this.loading = true;
		const editedVisitor = this.prepareVisitor(statusVisitor, button);
		this.updateVisitor(editedVisitor, withBack);
	}

	openLarge(content) {
		this.dialog.open(content, {
			data: {
				input: ""
			},
			maxWidth: "350px",
			minHeight: "150px",
		});
	}

	clickNo() {
		this.dialog.closeAll()
	}


	checkOutDatePicker(e) {
		const time = moment(new Date()).format("HH:mm");
		// this.formCheckOut.checkOut.setValue(moment(e.target.value).format('L'))
		this.formCheckOut.checkOut_jam.setValue(time)
		this.formCheckOut.checkOutDateValue.setValue(e.target.value)

		this.cd.markForCheck()
	}

	showOptions(event) {
		if (event.checked) this.checker = true;
		else this.checker = false
	}


	prepareVisitor(statusVisitor, button) {
		const controls = this.visitorForm.controls;
		// const _visitor = new VisitorModel();
		// _visitor.clear();
		// _visitor._id = this.visitor._id;
		// _visitor.unit = controls.unit.value;

		// _visitor.nama = controls.nama.value.toLowerCase();
		// _visitor.jenisKelamin = controls.jenisKelamin.value;
		// _visitor.keperluan = controls.keperluan.value;
		// _visitor.tanggal = controls.tanggal.value;
		// _visitor.jam = controls.jam.value;
		// _visitor.noTelp = controls.noTelp.value;
		// _visitor.createdBy = controls.createdBy.value;
		// _visitor.createdDate = controls.createdDate.value;

		// _visitor.updateBy = controls.updateBy.value;
		// _visitor.updateDate = controls.updateDate.value;

		// Flow Baru #START
		let resultStatus
		if (button === 'btnCancel') {
			resultStatus = 'cancel-by-web'
		} else {
			/* Update status condition (Status updates are in the visitor module for the visitor system flow) */
			resultStatus = this.moduleVisitor.flowStatusVisitor(statusVisitor)
		}

		// Appointment Request #START
		const formData = new FormData()
		// formData.append("unit", controls.unit.value)
		// formData.append("customerId", controls.customerId.value)
		// formData.append("tanggal", controls.tanggal.value)
		// formData.append("jam", controls.jam.value)
		// Appointment Request #END 

		// Check In #START
		if (statusVisitor === 'approve-by-web') {
			if (button === 'btnSubmit') {
				formData.append("checkIn", controls.checkIn.value)
				formData.append("checkIn_jam", controls.checkIn_jam.value)
			}
		}
		// Check In #END 

		// Check Out #START
		if (statusVisitor === 'check-in') {
			formData.append("checkOut", this.formCheckOut.checkOut.value)
			formData.append("checkOut_jam", this.formCheckOut.checkOut_jam.value)
		}
		// Check Out #END 

		// Guest Information #START
		if (statusVisitor === 'approve-by-web') {
			if (button === 'btnSubmit') {
				formData.append("guestId", controls.guestId.value)
				// formData.append("nama", controls.nama.value)
				// formData.append("jenisKelamin", controls.jenisKelamin.value)
				// formData.append("company", controls.company.value)
				// formData.append("address", controls.address.value)
				// if (controls.city.value) formData.append("city", controls.city.value)
				// formData.append("guestQty", controls.guestQty.value)
				// formData.append("noTelp", controls.noTelp.value)
				// formData.append("keperluan", controls.keperluan.value)
			}
		}

		if (this.checker) {
			formData.append("idCardType", controls.idCardType.value)
			formData.append("idCardNo", controls.idCardNo.value)
		}
		// Guest Information #END  

		// Tambahan #START
		statusVisitor === 'check-in' ? formData.append("isRead", JSON.stringify(true)) :
			formData.append("isRead", controls.isRead.value)
		formData.append("statusVisitor", resultStatus)

		// Attachment (start)
		if (this.myFiles.length > 0) {
			for (let i = 0; i < this.myFiles.length; i++) {
				formData.append("attachment", this.myFiles[i]);
			}
		} else if (this.images[0]) {
			const getFileNameAndFormat = this.visitor.attachment.split("/")[5];
			formData.append("attachment", getFileNameAndFormat)
		} else {
			formData.append("attachment", "")
		}
		// Attachment (end)

		// Foto Visitor (start)
		if (this.myFilesVisitorPict.length > 0) {
			for (let i = 0; i < this.myFilesVisitorPict.length; i++) {
				formData.append("visitorAttachment", this.myFilesVisitorPict[i]);
			}
		} else if (this.imagesVisitorPict[0]) {
			const getFileNameAndFormat = this.visitor.visitorAttachment.split("/")[5];
			formData.append("visitorAttachment", getFileNameAndFormat)
		} else {
			formData.append("visitorAttachment", "")
		}
		// Foto Visitor (end)

		// Tambahan #END 

		return formData;
	}

	updateVisitor(_visitor, withBack: boolean = false) {

		const addSubscription = this.service.updateVisitor(_visitor, this.idVisitor).subscribe(
			res => {
				this.clickNo()
				const message = `Visitor successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/visitor`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding package | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	// Change Status Visitor #START
	_getStatusClass(value: string) {
		if (value === "wait-confirm-web" || value === "wait-confirm-mob") return "chip--wait-confirm"
		else if (value === "approve-by-web" || value === "approve-by-mob") return "chip--approve"
		else if (value === "check-in") return "chip--check-in"
		else if (value === "check-out") return "chip--check-out"
		else if (value === "cancel-by-mob") return "chip--cancel"
		else if (value === "cancel-by-web") return "chip--cancel"
		else if (value === "reject-by-mob") return "chip--reject"
	}
	// Change Status Visitor #END

	// Upload Image (new) START
	selectFileUpload(e, status) {
		if (status === 'visitorPict') {
			const filesVisitorPict = (e.target as HTMLInputElement).files;

			if (filesVisitorPict.length > 1 || this.myFilesVisitorPict.length >= 1 || this.imagesVisitorPict.length >= 1) {
				this.fileInputEl.nativeElement.value = "";
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

	checkinDatePicker(event) {
		const time = moment(new Date()).format("HH:mm");
		// this.checkinDateForm.checkin_time.setValue(time)

		// Set Value To Form #START
		const controls = this.visitorForm.controls
		controls.checkIn.setValue(event.value)
		controls.checkIn_jam.setValue(time)
		// Set Value To Form #END
	}

	clearSelection(status) {
		if (status === 'visitorPict') {
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
	removeSelectedFile(item, status) {
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

	clickLainnya(stts) {
		if (stts) this.openLainnya = true;
		else this.openLainnya = false;
	}


	getComponentTitle() {
		let result = `Edit Visitor`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
