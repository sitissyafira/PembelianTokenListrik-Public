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


@Component({
	selector: 'kt-add-packages',
	templateUrl: './add-packages.component.html',
	styleUrls: ['./add-packages.component.scss']
})
export class AddPackagesComponent implements OnInit, OnDestroy {
	@ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;

	// Public properties
	type;
	datauser = localStorage.getItem("user");
	// date1 = new FormControl(new Date());
	date1 = moment(new Date()).format('L');
	packages: PackagesModel;
	PackagesId$: Observable<string>;
	oldPackages: PackagesModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	packagesForm: FormGroup;
	hasFormErrors = false;
	unitResult: any[] = [];
	UnitResultFiltered: any[] = [];
	CategoryResultFiltered: any[] = [];
	loading: boolean = false;
	selection = new SelectionModel<PackagesModel>(true, []);

	categoryResult: any[] = [
	]

	// Upload Image (new) START
	images: any[] = []
	myFiles: any[] = []

	// Upload Image (new) END

	codeNum

	pkgList: any[] = [{
		category: "",
		customCategory: "",
		sender: "",
		qty: ""
	}];
	@ViewChild('myTable', { static: false }) table: MatTable<any>;
	displayedColumns = ['category', 'sender', 'qty', 'action'];


	date = new Date();
	// time = new FormControl(this.date.getHours() + ":" + this.date.getMinutes())
	time = moment(new Date()).format('LT');
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
		private cd: ChangeDetectorRef

	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectPackagesActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectPackagesById(id))).subscribe(res => {
					if (res) {
						this.packages = res;
						this.oldPackages = Object.assign({}, this.packages);
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
		this.createForm();
		this.loadUnit();
		this.codePackage()
		this.getAllCategory()
	}

	createForm() {
		this.packagesForm = this.packagesFB.group({
			unit: [{ value: "", disabled: false }, Validators.required],
			contract: [{ value: "", disabled: false }, Validators.required],
			jam: [{ value: this.time, disabled: false }],
			contract_name: [{ value: "", disabled: false }, Validators.required],
			package_from: [""],
			receipient_name: [""],
			created_by: [this.datauser],
			created_date: [{ value: this.date1, disabled: false }],
			package_status: [{ value: "wait-confirm", disabled: false }, Validators.required],
			cdunt: [""],
			remarks: [""],

			// new FLOW
			packageId: [{ value: this.codeNum, disabled: false }, Validators.required],
		});


	}

	codePackage() {
		const controls = this.packagesForm.controls
		this.service.generateCode().subscribe(res => {
			this.codeNum = res.data
			controls.packageId.setValue(res.data)
			this.cd.markForCheck()
		})
	}

	getAllCategory() {
		this.service.getAllCategory().subscribe(res => {
			this.categoryResult = res.data
			this.CategoryResultFiltered = res.data
			this.CategoryResultFiltered.push({
				_id: "valCategoryEtc",
				name: "Lainnya",
			})
		})
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
		const controls = this.packagesForm.controls;
		controls.unit.setValue(id)
		this.serviceUnit.getUnitById(id).subscribe(
			data => {
				this.type = data.data.type;
				controls.cdunt.setValue(data.data.cdunt)

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


	categoryOnChange(id, name, value) {
		let data = {
			target: { value }
		}

		this.changeValue(id, name, data)
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

	onSubmit(withBack: boolean = false) {
		const result = []



		for (let i = 0; i < this.pkgList.length; i++) {
			result.push({
				category: this.pkgList[i].customCategory === "" ? this.pkgList[i].category : "lainnya",
				customCategory: this.pkgList[i].customCategory,
				qty: this.pkgList[i].qty,
				sender: this.pkgList[i].sender,
			}
			)
		}

		this.pkgList = result

		let ctg = this.pkgList[0].category, snd = this.pkgList[0].sender, qty = this.pkgList[0].qty
		let ctg2 = this.pkgList[this.pkgList.length - 1].category, snd2 = this.pkgList[this.pkgList.length - 1].sender, qty2 = this.pkgList[this.pkgList.length - 1].qty
		const message = `Please.. Complete filling in package details!`;

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
		if (ctg === "" || snd === "" || qty === "") {
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			return
		} else if (ctg2 === "" || snd2 === "" || qty2 === "") {
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			return
		}

		// Condition If Not Image (Start)
		if (!this.myFiles.length) {
			const message = `Select Image minimal 1`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);

			return
		}
		// Condition If Not Image (End)

		this.loading = true;
		const editedPackages = this.preparePackages();
		this.addPackages(editedPackages, withBack);
	}


	preparePackages(): PackagesModel {
		const controls = this.packagesForm.controls;

		// Change To Form Data
		let formData: any = new FormData();
		for (let i = 0; i < this.myFiles.length; i++) {
			formData.append("file", this.myFiles[i]);
		}
		// formData.append("_id", this.packages._id)
		formData.append("contract", controls.contract.value)
		formData.append("contract_name", controls.contract_name.value)
		formData.append("unit", controls.unit.value)
		formData.append("receipient_name", controls.receipient_name.value)
		formData.append("package_from", controls.package_from.value)
		formData.append("created_by", controls.created_by.value)
		// formData.append("created_date", controls.created_date.value)
		formData.append("created_date", new Date())
		formData.append("cdunt", controls.cdunt.value)
		formData.append("remarks", controls.remarks.value)

		// new flow
		formData.append("package_status", controls.package_status.value)
		formData.append("packageDetail", JSON.stringify(this.pkgList))
		formData.append("packageId", this.codeNum)


		return formData;
	}

	addPackages(_packages, withBack: boolean = false) {
		const addSubscription = this.service.createPackages(_packages).subscribe(
			res => {
				const message = `New package successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
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

	changeValue(id, name, event) {
		if (name === 'category') {
			if (event.target.value === "valCategoryEtc") {
				this.pkgList[id]['customCategory'] = 'check'
				this.pkgList[id]['category'] = 'lainnya'

				this.checkCategory(id)
			} else {
				this.pkgList[id]['customCategory'] = ''
			}
		}


		if (name === 'qty') this.pkgList[id][name] = parseInt(event.target.value);
		else this.pkgList[id][name] = event.target.value;

		this.table.renderRows();
	}

	addCC(id) {
		let ctg = this.pkgList[id].category, snd = this.pkgList[id].sender, qty = this.pkgList[id].qty, cc = this.pkgList[id].customCategory

		const message = `Please.. Complete filling in package details!`;
		if (ctg === "" || snd === "" || qty === "") {
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			return
		} else if (ctg === "valCategoryEtc") {
			if (cc === "check") {
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				return
			}
		}

		this.pkgList.push({ category: "", customCategory: "", sender: "", qty: "" });
		this.getAllCategory()
		this.table.renderRows();
	}

	removeCC(i: number) {
		this.pkgList.splice(i, 1);
		this.table.renderRows();
	}

	// Upload Image (new) START
	selectFileUpload(e) {
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

	_onKeyupCategory(e: any) {
		this._filterCatList(e.target.value);
	}

	_filterCatList(text: string) {
		this.CategoryResultFiltered = this.categoryResult.filter((i) => {
			const filterText = `${i.name.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}


	checkCategory(id) {
		if (this.pkgList[id].customCategory !== "") return `hide${id}`
		else return 'no-hide col-md-12'
	}

	clearSelection() {
		this.myFiles = [];
		this.images = [];
		this.fileInputEl.nativeElement.value = "";
		this.cd.markForCheck();
	}
	removeSelectedFile(item) {
		this.myFiles = this.myFiles.filter(i => i.name !== item.name);
		this.images = this.images.filter(i => i.url !== item.url);
		this.fileInputEl.nativeElement.value = "";

		this.cd.markForCheck();
	}
	// Upload Image (new) END
	_onKeyupUnit(e: any) {
		this._filterCstmrList(e.target.value);
	}

	_filterCstmrList(text: string) {
		this.UnitResultFiltered = this.unitResult.filter((i) => {
			const filterText = `${i.cdunt.toLocaleLowerCase()}`;
			if (filterText.includes(text.toLocaleLowerCase())) return i;
		});
	}

	getComponentTitle() {
		let result = 'Create Package Information';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
