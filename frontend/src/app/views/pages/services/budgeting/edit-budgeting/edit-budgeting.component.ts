// import {Component, OnDestroy, OnInit} from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// // RxJS
// import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// // NGRX
// import { Store, select } from '@ngrx/store';
// import { Update } from '@ngrx/entity';
// import { AppState } from '../../../../../core/reducers';
// // Layout
// import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
// import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// import {PackagesModel} from "../../../../../core/services/packages/packages.model";
// import {
// 	selectLastCreatedPackagesId,
// 	selectPackagesActionLoading,
// 	selectPackagesById
// } from "../../../../../core/services/packages/packages.selector";
// import { PackagesService } from '../../../../../core/services/packages/packages.service';
// import { QueryOwnerTransactionModel } from '../../../../../core/contract/ownership/queryowner.model';
// import { SelectionModel } from '@angular/cdk/collections';
// import { UnitService } from '../../../../../core/unit/unit.service';
// import { OwnershipContractService } from '../../../../../core/contract/ownership/ownership.service';
// import { LeaseContractService } from '../../../../../core/contract/lease/lease.service';


// @Component({
//   selector: 'kt-edit-packages',
//   templateUrl: './edit-packages.component.html',
//   styleUrls: ['./edit-packages.component.scss']
// })
// export class EditPackagesComponent implements OnInit, OnDestroy {
// 	// Public properties
// 	type;
// 	PhoneNo;
// 	Name;
// 	time;

// 	datauser = localStorage.getItem("user");
// 	packages: PackagesModel;
// 	PackagesId$: Observable<string>;
// 	oldPackages: PackagesModel;
// 	selectedTab = 0;
// 	loading$: Observable<boolean>;
// 	packagesForm: FormGroup;
// 	hasFormErrors = false;
// 	unitResult: any[] = [];
// 	loading : boolean = false;
// 	selection = new SelectionModel<PackagesModel>(true, []);
// 	date1 = new FormControl(new Date());
// 	istenant: boolean = false;

// 	// Private properties
// 	private subscriptions: Subscription[] = [];
//   	constructor(
// 		private activatedRoute: ActivatedRoute,
// 		private router: Router,
// 		private packagesFB: FormBuilder,
// 		private subheaderService: SubheaderService,
// 		private layoutUtilsService: LayoutUtilsService,
// 		private store: Store<AppState>,
// 		private service: PackagesService,
// 		private serviceUnit : UnitService,
// 		private ownService : OwnershipContractService,
// 		private leaseService : LeaseContractService,
// 		private layoutConfigService: LayoutConfigService
// 	) { }

//   	ngOnInit() {
// 		this.loading$ = this.store.pipe(select(selectPackagesActionLoading));
// 		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
// 			const id = params.id;
// 			if (id) {
// 				this.store.pipe(select(selectPackagesById(id))).subscribe(res => {
// 					if (res) {
// 						this.packages = res;
// 						this.oldPackages = Object.assign({}, this.packages);
// 						this.initPackages();
// 					}
// 				});
// 			} else {
// 				this.packages = new PackagesModel();
// 				this.packages.clear();
// 				this.initPackages();
// 			}
// 		});
// 		this.subscriptions.push(routeSubscription);
//   	}

// 	initPackages() {
// 		this.createForm();
// 		this.loadUnit();
// 		this.getData();
// 		this.getTime();
// 	}

// 	createForm() {
// 		this.packagesForm = this.packagesFB.group({
// 			unit: [{value:this.packages.unit._id, disabled:true}],
// 			contract: [this.packages.contract],
// 			contract_name: [{value:this.packages.contract_name, disabled:true}],
// 			package_from: [{value:this.packages.package_from, disabled:true}],
// 			receipient_name : [{value:this.packages.receipient_name, disabled:true}],
// 			created_by: [this.packages.created_by],
// 			created_date: [{value:this.packages.created_date, disabled:true}],
// 			jam: [{"value":"", disabled:true}],

// 			package_status: ["out"],
// 			cdunt : [this.packages.cdunt],
// 			remarks : [{value:this.packages.remarks, disabled:true}],
// 			isTenant : [""],
// 			pic_number : [""],
// 			description: [""],
	
// 			confirmed_date: [{value:this.date1.value, disabled:true}],
// 			pic_name : [""],
// 			updated_by: [this.datauser],
// 			updated_date: [{value:this.date1.value, disabled:true}]

// 		});
// 	}

// 	loadUnit(){
// 		this.selection.clear();
// 		const queryParams = new QueryOwnerTransactionModel(
// 			null,
// 			"asc",
// 			null,
// 			1,
// 			10
// 		);
// 		this.serviceUnit.getDataUnitForParking(queryParams).subscribe(
// 			res => {
// 				this.unitResult = res.data;
// 			}
// 		);
// 	}

// 	getTime(){
// 		const controls = this.packagesForm.controls;
// 		const date = new Date(this.packages.created_date);
// 		this.time = new FormControl(date.getHours() + ":" + date.getMinutes())
// 		console.log(typeof this.time)
// 		console.log(this.time);
// 		controls.jam.setValue(this.time.value);
// 	}

// 	unitOnChange(id){
// 		this.serviceUnit.getUnitById(id).subscribe(
// 			data => {
// 				this.type = data.data.type;
// 				if (this.type == "owner" || this.type == "pp"){
// 					this.ownService.findOwnershipContractByUnit(id).subscribe(
// 						dataowner => {
// 							this.packagesForm.controls.contract.setValue(dataowner.data[0]._id);
// 							this.packagesForm.controls.contract_name.setValue(dataowner.data[0].contact_name);
// 						}
// 					)
// 				}else{
// 						this.leaseService.findLeaseContractByUnit(id).subscribe(
// 							datalease => {
// 								this.packagesForm.controls.contract.setValue(datalease.data[0]._id);
// 								this.packagesForm.controls.contract_name.setValue(datalease.data[0].contact_name);
// 						}
// 					)
// 				}
// 			}
// 		)
// 	}

// 	getData(){
// 		this.serviceUnit.getUnitById(this.packages.unit._id).subscribe(
// 			data => {
// 				this.type = data.data.type;
// 				if (this.type == "owner" || this.type == "pp"){
// 					this.ownService.findOwnershipContractByUnit(this.packages.unit._id).subscribe(
// 						dataowner => {
// 							this.PhoneNo = dataowner.data[0].contact_phone
// 							this.Name = dataowner.data[0].contact_name
// 						}
// 					)
// 				}else{
// 						this.leaseService.findLeaseContractByUnit(this.packages.unit._id).subscribe(
// 							datalease => {
// 								this.PhoneNo = datalease.data[0].contact_phone
// 								this.Name = datalease.data[0].contact_name;
// 						}
// 					)
// 				}
// 			}
// 		)
// 	}

// 	changeTenant(){
// 		const controls = this.packagesForm.controls;
// 		if (this.istenant == true){
// 			controls.pic_number.setValue(this.PhoneNo);
// 			controls.pic_name.setValue(this.Name);
// 		} else {
// 			controls.pic_number.setValue("");
// 			controls.pic_name.setValue("");
// 		}
// 	}


// 	goBackWithId() {
// 		const url = `/packages`;
// 		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
// 	}

// 	refreshPackages(isNew: boolean = false, id:string = "") {
// 		let url = this.router.url;
// 		if (!isNew) {
// 			this.router.navigate([url], { relativeTo: this.activatedRoute });
// 			return;
// 		}

// 		url = `/packages/edit/${id}`;
// 		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
// 	}


// 	onSubmit(withBack: boolean = false) {
// 		this.hasFormErrors = false;
// 		const controls = this.packagesForm.controls;
// 		/** check form */
// 		if (this.packagesForm.invalid) {
// 			Object.keys(controls).forEach(controlName =>
// 				controls[controlName].markAsTouched()
// 			);

// 			this.hasFormErrors = true;
// 			this.selectedTab = 0;
// 			return;
// 		}


// 		this.loading = true;
// 		const editedPackages = this.preparePackages();
// 		this.updatePackages(editedPackages, withBack);
// 	}


// 	preparePackages(): PackagesModel {
// 		const controls = this.packagesForm.controls;
// 		const _packages = new PackagesModel();
// 		_packages.clear();
// 		_packages._id = this.packages._id;
// 		_packages.contract = controls.contract.value;
// 		_packages.contract_name = controls.contract_name.value;
// 		_packages.unit = controls.unit.value;
// 		_packages.receipient_name = controls.receipient_name.value;
// 		_packages.package_from = controls.package_from.value;
// 		_packages.created_by = controls.created_by.value;
// 		_packages.created_date = controls.created_date.value;
// 		_packages.package_status = controls.package_status.value;
// 		_packages.cdunt = controls.cdunt.value;
// 		_packages.remarks = controls.remarks.value;
		
// 		_packages.pic_number = controls.pic_number.value;
// 		_packages.isTenant = controls.isTenant.value;
// 		_packages.description = controls.description.value;
		

// 		_packages.confirmed_date = controls.confirmed_date.value;
// 		_packages.pic_name = controls.pic_name.value;
// 		_packages.updated_by = controls.updated_by.value;
// 		_packages.updated_date = controls.updated_date.value;
// 		return _packages;
// 	}

// 	updatePackages(_packages: PackagesModel, withBack: boolean = false) {

// 		const addSubscription = this.service.updatePackages(_packages).subscribe(
// 			res => {
// 				const message = `Package successfully has been saved.`;
// 				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
// 				const url = `/packages`;
// 				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
// 			},
// 			err => {
// 				console.error(err);
// 				const message = 'Error while adding package | ' + err.statusText;
// 				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
// 			}
// 		);
// 		this.subscriptions.push(addSubscription);
// 	}

// 	getComponentTitle() {
// 		let result = `Edit Packages`;
// 		return result;
// 	}

// 	onAlertClose($event) {
// 		this.hasFormErrors = false;
// 	}

//   	ngOnDestroy() {
// 		this.subscriptions.forEach(sb => sb.unsubscribe());
// 	}
	
// 	inputKeydownHandler(event) {
// 		return event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key)) || event.key === '.';
// 	}
// }
