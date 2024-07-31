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
import { PackagesModel } from "../../../../../core/services/packages/packages.model";
import {
	selectLastCreatedPackagesId,
	selectPackagesActionLoading,
	selectPackagesById
} from "../../../../../core/services/packages/packages.selector";
import { PackagesService } from '../../../../../core/services/packages/packages.service';
import { QueryOwnerTransactionModel } from '../../../../../core/contract/ownership/queryowner.model';
import { SelectionModel } from '@angular/cdk/collections';
import { UnitService } from '../../../../../core/unit/unit.service';
import { OwnershipContractService } from '../../../../../core/contract/ownership/ownership.service';
import { LeaseContractService } from '../../../../../core/contract/lease/lease.service';
import { MatTable } from '@angular/material';
import moment from 'moment';
import { ModulePackage } from '../../../../../core/services/packages/module/moduleservice';


@Component({
	selector: 'kt-edit-packages',
	templateUrl: './edit-packages.component.html',
	styleUrls: ['./edit-packages.component.scss']
})
export class EditPackagesComponent implements OnInit, OnDestroy {
	@ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;
	@ViewChild('fileInputReceiver', { static: false }) fileInputReceiverEl: ElementRef;

	// Public properties
	type;
	PhoneNo;
	Name;
	time;

	datauser = localStorage.getItem("user");
	packages: PackagesModel;
	PackagesId$: Observable<string>;
	oldPackages: PackagesModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	packagesForm: FormGroup;
	hasFormErrors = false;
	unitResult: any[] = [];
	UnitResultFiltered: any[] = [];
	loading: boolean = false;
	selection = new SelectionModel<PackagesModel>(true, []);
	date1 = new FormControl(new Date());
	istenant: boolean = false;

	// Section One # Package Information
	packageInformation = {
		entryDate: new FormControl(),
		entryTime: new FormControl(),
		unit: new FormControl(),
		cstmr: new FormControl(),
		packageId: new FormControl()
	}

	// Section Two # Package Detail
	pkgList: any[] = [{
		category: "",
		customCategory: "",
		sender: "",
		qty: ""
	}];

	// Section Three # Receive Detail
	packageReceive = {
		receive_name: new FormControl(),
		phone_number: new FormControl(),
		receive_date: new FormControl(),
		receive_time: new FormControl(),
		receiveDateValue: new FormControl(),
		remarks: new FormControl()
	}

	// Status Packages
	packageStatus = new FormControl()

	@ViewChild('myTable', { static: false }) table: MatTable<any>;
	displayedColumns = ['category', 'sender', 'qty', 'action'];

	categoryResult: any[] = []
	CategoryResultFiltered: any[] = []

	// Upload Image (new) START
	images: any[] = []
	myFiles: any[] = []
	imagesReceiver: any[] = []
	myFilesReceiver: any[] = []

	// Upload Image (new) END



	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private packagesFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: PackagesService,
		private serviceUnit: UnitService,
		private ownService: OwnershipContractService,
		private leaseService: LeaseContractService,
		private layoutConfigService: LayoutConfigService,
		private cd: ChangeDetectorRef,
		public modulePackage: ModulePackage, // services for flow package systems (ex: changeStatus > to change status, etc.)
	) { }

	idParam: string = ""

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectPackagesActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			this.idParam = id
			if (id) {
				this.service.findPackagesById(id).subscribe(res => {
					if (res) {
						// #Update Is Read
						this.service.updateIsRead(id).subscribe()
						this.packages = res.data;
						this.createWithFormControl(res.data)
						this.initPackages();
						this.cd.markForCheck()
					}
				});
			} else {
				this.packages = new PackagesModel();
				this.packages.clear();
				this.initPackages();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	initPackages() {
		this.createForm();
		this.getAllCategory()
		this.loadUnit();
	}

	createForm() {
		this.packagesForm = this.packagesFB.group({
			unit: [this.packages.unit ? this.packages.unit._id : ""],
			contract: [this.packages.contract._id],
			jam: [moment(this.packages.created_date).format('LT')],
			contract_name: [this.packages.contract_name],
			package_from: [this.packages.package_from ? this.packages.package_from : ""],
			receipient_name: [this.packages.receipient_name ? this.packages.receipient_name : ""],
			created_by: [this.datauser],
			created_date: [moment(this.packages.created_date).format('l')],
			package_status: [this.packages.package_status],
			cdunt: [this.packages.cdunt],
			remarks: [this.packages.remarks],
			// new FLOW
			packageId: [this.packages.packageId],
			receive_name: [this.packages.receiveDetail ? this.packages.receiveDetail.receive_name : ""],
			phone_number: [this.packages.receiveDetail ? this.packages.receiveDetail.phone_number : ""],
			receive_date: [this.packages.receiveDetail ? this.packages.receiveDetail.receive_date : ""],
			receive_time: [this.packages.receiveDetail ? this.packages.receiveDetail.receive_date : ""],
		});
	}

	createWithFormControl(data) {
		// Set Value Package Information #section One #START
		this.packageInformation.entryDate.setValue(moment(data.created_date).format('l'))
		this.packageInformation.entryTime.setValue(moment(data.created_date).format('LT'))
		this.packageInformation.unit.setValue(data.cdunt.toUpperCase())
		this.packageInformation.cstmr.setValue(data.contract_name)
		this.packageInformation.packageId.setValue(data.packageId)
		// Set Value Package Information #section One #END

		// Set Value Package Detail #section Two #START
		this.pkgList = data.packageDetail
		// Set Value Package Detail #section Two #END

		// Set Value Package Receive (Opsional) #START
		this.packageReceive.receive_name.setValue(data.receiveDetail ? data.receiveDetail.receive_name : "")
		this.packageReceive.phone_number.setValue(data.receiveDetail ? data.receiveDetail.phone_number : "")
		this.packageReceive.receive_date.setValue(data.receiveDetail ? moment(data.receiveDetail.receive_date).format('l') : "")
		this.packageReceive.receive_time.setValue(data.receiveDetail ? moment(data.receiveDetail.receive_date).format('LT') : "")
		this.packageReceive.remarks.setValue(data.remarks)
		// Set Value Package Receive (Opsional) #End

		this.packageStatus.setValue(data.package_status)
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
				this.UnitResultFiltered = res.data
				this.cd.markForCheck()
			}
		);
	}

	unitOnChange(id) {
		this.serviceUnit.getUnitById(id).subscribe(
			data => {
				this.type = data.data.type;
				if (this.type == "owner" || this.type == "pp") {
					this.ownService.findOwnershipContractByUnit(id).subscribe(
						dataowner => {
							this.packagesForm.controls.contract.setValue(dataowner.data[0]._id);
							this.packagesForm.controls.contract_name.setValue(dataowner.data[0].contact_name);
						}
					)
				} else {
					this.leaseService.findLeaseContractByUnit(id).subscribe(
						datalease => {
							this.packagesForm.controls.contract.setValue(datalease.data[0]._id);
							this.packagesForm.controls.contract_name.setValue(datalease.data[0].contact_name);
						}
					)
				}
			}
		)
	}

	getData() {
		this.serviceUnit.getUnitById(this.packages.unit).subscribe(
			data => {
				this.type = data.data.type;
				if (this.type == "owner" || this.type == "pp") {
					this.ownService.findOwnershipContractByUnit(this.packages.unit.toString()).subscribe(
						dataowner => {
							this.PhoneNo = dataowner.data[0].contact_phone
							this.Name = dataowner.data[0].contact_name
						}
					)
				} else {
					this.leaseService.findLeaseContractByUnit(this.packages.unit.toString()).subscribe(
						datalease => {
							this.PhoneNo = datalease.data[0].contact_phone
							this.Name = datalease.data[0].contact_name;
						}
					)
				}
			}
		)
	}

	getAllCategory() {
		this.service.getAllCategory().subscribe(res => {
			this.categoryResult = res.data
			this.CategoryResultFiltered = res.data

			this.CategoryResultFiltered.push({
				_id: "valCategoryEtc",
				name: "Lainnya",
			})

			this.cd.markForCheck()
		})
	}

	changeTenant() {
		const controls = this.packagesForm.controls;
		if (this.istenant == true) {
			controls.pic_number.setValue(this.PhoneNo);
			controls.pic_name.setValue(this.Name);
		} else {
			controls.pic_number.setValue("");
			controls.pic_name.setValue("");
		}
	}


	goBackWithId() {
		const url = `/packages`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshPackages(isNew: boolean = false, id: string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/packages/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}


	onSubmit(withBack: boolean = false, validate) {
		this.hasFormErrors = false;
		const controls = this.packagesForm.controls;
		/** check form */
		if (this.packagesForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		if (validate === 'confirm') {
			const receiveName = this.packageReceive.receive_name.value
			const receiveDate = this.packageReceive.receive_date.value
			const phoneNumber = this.packageReceive.phone_number.value
			if (!receiveName || !receiveDate || !phoneNumber) {
				const message = `Enter receiver details to confirm`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				return
			}
		}


		this.loading = true;
		const editedPackages = this.preparePackages(validate);
		this.updatePackages(editedPackages, withBack);
	}

	categoryOnChange(id, name, value) {
		let data = {
			target: { value }
		}
		this.changeValue(id, name, data)
	}

	changeValue(id, name, event) {
		if (name === 'category') {
			if (event.target.value._id === "valCategoryEtc") {
				this.pkgList[id]['customCategory'] = 'check'
				this.pkgList[id]['category'] = { name: 'lainnya' }
				this.checkCategory(id)
			} else {
				this.pkgList[id]['customCategory'] = ''
			}
		}

		if (name === 'qty') this.pkgList[id][name] = parseInt(event.target.value);
		else this.pkgList[id][name] = event.target.value;

		this.table.renderRows();
	}

	changeValueReceive(event, status) {
		if (status === 'name') this.packageReceive.receive_name.setValue(event.target.value)
		else if (status === 'phone') this.packageReceive.phone_number.setValue(event.target.value)
		else if (status === 'remarks') this.packageReceive.remarks.setValue(event.target.value)
	}

	addCC(id) {
		let ctg = this.pkgList[id].category, snd = this.pkgList[id].sender, qty = this.pkgList[id].qty, cc = this.pkgList[id].customCategory

		const message = `Please.. Complete filling in package details!`;
		if (ctg === "" || snd === "" || qty === "") {
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			return
		} else if (ctg.name === "Lainnya") {
			if (cc === "check") {
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				return
			}
		}

		this.pkgList.push({ category: "", customCategory: "", sender: "", qty: "" });
		this.getAllCategory()
		this.table.renderRows();
	}

	_onKeyupCategory(e: any) {
		this._filterCatList(e.target.value);
	}

	_filterCatList(text: string) {
		this.CategoryResultFiltered = this.categoryResult.filter((i) => {
			const filterText = `${i.name.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}


	receiveDatePicker(e) {
		this.packageReceive.receive_time.setValue(moment(new Date()).format('LT'))

		const date = moment(e.target.value).format("L");
		const time = moment(new Date()).format("HH:mm");
		const result = `${date} ${time}`;
		this.packageReceive.receiveDateValue.setValue(result)

		this.cd.markForCheck()
	}

	removeCC(i: number) {
		this.pkgList.splice(i, 1);
		this.table.renderRows();
	}




	preparePackages(validate) {
		const controls = this.packagesForm.controls;
		const status = controls.package_status.value

		const result = []
		for (let i = 0; i < this.pkgList.length; i++) {
			result.push({
				category: this.pkgList[i].customCategory === "" ? this.pkgList[i].category._id : "lainnya",
				customCategory: this.pkgList[i].customCategory,
				qty: this.pkgList[i].qty,
				sender: this.pkgList[i].sender,
			}
			)
		}

		// new flow form data
		let formData: any = new FormData();


		if (this.myFiles.length !== 0) {
			for (let i = 0; i < this.myFiles.length; i++) {
				formData.append("file", this.myFiles[i]);
			}
		}
		if (this.myFilesReceiver.length !== 0) {
			for (let i = 0; i < this.myFilesReceiver.length; i++) {
				formData.append("handoverAttachment", this.myFilesReceiver[i]);
			}
		}

		// formData.append("_id", this.packages._id)
		formData.append("contract", controls.contract.value)
		formData.append("contract_name", controls.contract_name.value)
		formData.append("unit", controls.unit.value)
		formData.append("receipient_name", controls.receipient_name.value)
		formData.append("package_from", controls.package_from.value)
		formData.append("created_by", controls.created_by.value)
		formData.append("created_date", controls.created_date.value)
		formData.append("cdunt", controls.cdunt.value.toLowerCase())
		formData.append("remarks", this.packageReceive.remarks.value)


		if (validate === 'confirm') {
			formData.append("package_status", "done-confirm")
			formData.append("confirmed_date", JSON.stringify(Date.now()))

			let receiveDetail = {
				receive_name: this.packageReceive.receive_name.value,
				phone_number: this.packageReceive.phone_number.value,
				receive_date: this.packageReceive.receiveDateValue.value,
			}

			formData.append("receiveDetail", JSON.stringify(receiveDetail))
		} else {
			/* Update status condition (Status updates are in the package module for the package system flow) */
			let statusResult = this.modulePackage.flowStatusPackage(status)
			formData.append("package_status", statusResult);

			if (this.packages.receiveDetail) formData.append("receiveDetail", JSON.stringify(this.packages.receiveDetail));
			else formData.append("receiveDetail", JSON.stringify(null));
		}


		formData.append("packageDetail", JSON.stringify(result))
		formData.append("packageId", controls.packageId.value)
		formData.append("isRead", false)

		return formData
	}

	// onTester() {

	// }

	updatePackages(_packages, withBack: boolean = false) {
		const addSubscription = this.service.updatePackages({ data: _packages, _id: this.packages._id }).subscribe(
			res => {
				const message = `Package successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/packages`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				if (err.status === 409) {
					const message = err.error.data
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				} else {
					const message = 'Error while adding package | ' + err.statusText;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				}
			}
		);
		this.subscriptions.push(addSubscription);
		this.loading = false
	}

	checkCategory(id) {
		if (this.pkgList[id].customCategory !== "") {
			return `hide${id}`
		}
		else return 'no-hide col-md-12'
	}

	_onKeyupUnit(e: any) {
		this._filterCstmrList(e.target.value);
	}

	_filterCstmrList(text: string) {
		this.UnitResultFiltered = this.unitResult.filter((i) => {
			const filterText = `${i.cdunt.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}

	selectFileUpload(e, status) {
		if (status === 'receivePict') {
			const files = (e.target as HTMLInputElement).files;

			if (files.length > 15 || this.myFilesReceiver.length >= 15 || this.imagesReceiver.length >= 15) {
				this.fileInputEl.nativeElement.value = "";
				const message = `Only 15 imagesReceiver are allowed to select`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);

				return
			}

			for (let i = 0; i < files.length; i++) {
				// Skip uploading if file is already selected
				const alreadyIn = this.myFilesReceiver.filter(tFile => tFile.name === files[i].name).length > 0;
				if (alreadyIn) continue;

				this.myFilesReceiver.push(files[i]);

				const reader = new FileReader();
				reader.onload = () => {
					this.imagesReceiver.push({ name: files[i].name, url: reader.result });
					this.cd.markForCheck();
				}
				reader.readAsDataURL(files[i]);
			}
		} else {
			const files = (e.target as HTMLInputElement).files;

			if (files.length > 15 || this.myFiles.length >= 15 || this.images.length >= 15) {
				this.fileInputEl.nativeElement.value = "";
				const message = `Only 15 images are allowed to select`;
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

	changeButtonSave() {
		const value = this.packages.package_status
		if (value === "wait-confirm") return "Waiting For Confirmation"
		else if (value === "done-confirm") return "Confirmed"
		else if (value === "done") return "Done"
	}

	clearSelection(status) {
		if (status === 'receivePict') {
			this.myFilesReceiver = [];
			this.imagesReceiver = [];
			this.fileInputReceiverEl.nativeElement.value = "";
		} else {
			this.myFiles = [];
			this.images = [];
			this.fileInputEl.nativeElement.value = "";
		}
		this.cd.markForCheck();
	}

	removeSelectedFile(item, status) {
		if (status === 'receivePict') {
			this.myFilesReceiver = this.myFilesReceiver.filter(i => i.name !== item.name);
			this.imagesReceiver = this.imagesReceiver.filter(i => i.url !== item.url);
			this.fileInputReceiverEl.nativeElement.value = "";
		} else {
			this.myFiles = this.myFiles.filter(i => i.name !== item.name);
			this.images = this.images.filter(i => i.url !== item.url);
			this.fileInputEl.nativeElement.value = "";
		}

		this.cd.markForCheck();
	}

	getComponentTitle() {
		let result = `Edit Package InformationInformasi Paket`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	inputKeydownHandler(event) {
		return event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key)) || event.key === '.';
	}
}
