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
	selector: 'kt-view-packages',
	templateUrl: './view-packages.component.html',
	styleUrls: ['./view-packages.component.scss']
})
export class ViewPackagesComponent implements OnInit, OnDestroy {
	@ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;

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
		remarks: new FormControl()
	}

	packageStatus = new FormControl()

	@ViewChild('myTable', { static: false }) table: MatTable<any>;
	displayedColumns = ['category', 'sender', 'qty', 'action'];

	categoryResult: any[] = [{ _id: 1, name: "Document", }, { _id: 2, name: "Electronic", }, { _id: "valCategoryEtc", name: "Lainnya", },
	]



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
		public modulePackage: ModulePackage,  // services for flow package systems (ex: changeStatus > to change status, etc.)
	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectPackagesActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.service.findPackagesById(id).subscribe(res => {
					if (res) {
						this.packages = res.data;
						this.createWithFormControl(res.data)
						this.initPackages();
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
		this.loadUnit();
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


	categoryOnChange(id, name, value) {
		let data = {
			target: { value }
		}

		this.changeValue(id, name, data)
	}



	changeValue(id, name, event) {
		if (event.target.value === "valCategoryEtc") {
			this.pkgList[id]['customCategory'] = 'check'
			this.pkgList[id]['category'] = 'lainnya'

			this.checkCategory(id)
		} else if (name === 'qty') this.pkgList[id][name] = parseInt(event.target.value);
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
		} else if (ctg === "lainnya") {
			if (cc === "check") {
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				return
			}
		}

		this.pkgList.push({ category: "", customCategory: "", sender: "", qty: "" });
		this.table.renderRows();
	}

	removeCC(i: number) {
		this.pkgList.splice(i, 1);
		this.table.renderRows();
	}

	checkCategory(id) {
		if (this.pkgList[id].customCategory !== "") {
			return `hide${id}`
		}
		else return 'no-hide col-md-12'
	}

	changeButtonSave() {
		const value = this.packages.package_status
		if (value === "wait-confirm") return "Waiting For Confirmation"
		else if (value === "done-confirm") return "Confirmed"
		else if (value === "done") return "Done"
	}

	clearSelection() {
		this.fileInputEl.nativeElement.value = "";
		this.cd.markForCheck();
	}

	getComponentTitle() {
		let result = `View Package Information`;
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
