import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';

import { PackagesModel } from '../../../../../core/services/packages/packages.model';
import { PackagesDeleted, PackagesPageRequested } from '../../../../../core/services/packages/packages.action';
import { PackagesDataSource } from '../../../../../core/services/packages/packages.datasource';
import { SubheaderService } from '../../../../../core/_base/layout';
import { PackagesService } from '../../../../../core/services/packages/packages.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../../../environments/environment';
import { QueryPackagesModel } from '../../../../../core/services/packages/querypackages.model';
import { FormControl } from '@angular/forms';
import { ModulePackage } from '../../../../../core/services/packages/module/moduleservice';

@Component({
	selector: 'kt-list-packages',
	templateUrl: './list-packages.component.html',
	styleUrls: ['./list-packages.component.scss']
})
export class ListPackagesComponent implements OnInit, OnDestroy {
	file;
	dataSource: PackagesDataSource;
	displayedColumns = [
		'isRead',
		'pacID',
		'cdunt',
		'contract_name',
		'entry',
		'status',
		'confirmed_date',
		'created_date',
		'actions'];

	filterBy = {
		control: new FormControl(),
		val: undefined
	}
	filterByStatus = {
		control: new FormControl(),
		val: undefined
	}


	isClearFilter: boolean = false

	valueFiltered = { category: new FormControl(), status: new FormControl() }


	date = {
		valid: false,
		start: {
			control: new FormControl(),
			val: undefined,
		},
		end: {
			control: new FormControl(),
			val: undefined,
		},
	};
	// date End
	filterCategory: any = [
		{ name: "Unit", value: "unit", },
		{ name: "Customer", value: "customer", },
		{ name: "ID Paket", value: "packageId", },
	]

	filterStatusDelivery: any = [
		{ name: "Waiting For Confirmation", value: "wait-confirm", },
		{ name: "Confirmed", value: "done-confirm", },
		{ name: "Taken", value: "taken", },
		{ name: "Done", value: "done", },
	]


	isSearch: boolean = false
	placeHolderSearch = "*Select Category"

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<PackagesModel>(true, []);
	packagesResult: PackagesModel[] = [];
	data = localStorage.getItem("currentUser");
	dataUser = JSON.parse(this.data)
	role = this.dataUser.role
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private modulePackage: ModulePackage,  // services for flow package systems (ex: changeStatus > to change status, etc.)
		private store: Store<AppState>,
		private router: Router,
		private service: PackagesService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		private http: HttpClient,
		private modalService: NgbModal
	) { }

	ngOnInit() {
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadPackagesList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(500), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadPackagesList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Package Management');

		// Init DataSource
		this.dataSource = new PackagesDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(
			res => {
				this.packagesResult = res;
			},
			err => {
				alert('error');
			}
		);
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadPackagesList();
	}

	filterConfiguration(): any {
		const filter: any = {};
		// filter.unit2 = `${searchText}`;
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();

		filter.category = this.valueFiltered.category.value ? this.valueFiltered.category.value : "";
		filter.input = `${searchText}`;
		filter.startDate = this.date.start.control.value ? this.date.start.control.value : "";
		filter.endDate = this.date.end.control.value ? this.date.end.control.value : "";
		filter.status = this.valueFiltered.status.value ? this.valueFiltered.status.value : "";

		return filter;
	}

	// Value choose category START
	valueChooseCategory(e: string) {
		this.isClearFilter = true
		if (e === "unit") {
			this.placeHolderSearch = "Unit";
			this.valueFiltered.category.setValue(e)
			this.isSearch = true
		} else if (e === "customer") {
			this.placeHolderSearch = "Customer"
			this.valueFiltered.category.setValue(e)
			this.isSearch = true
		} else if (e === "packageId") {
			this.placeHolderSearch = "ID Paket"
			this.valueFiltered.category.setValue(e)
			this.isSearch = true
		}
		this.loadPackagesList()
	}
	valueChooseStatus(e: string) {
		this.valueFiltered.status.setValue(e)
		this.isClearFilter = true
		this.loadPackagesList()
	}
	// Value choose category END

	loadPackagesList() {
		this.selection.clear();
		const queryParams = new QueryPackagesModel(
			this.filterConfiguration(),
			this.paginator.pageIndex + 1,
			this.paginator.pageSize
		);
		this.store.dispatch(new PackagesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	addDate(type, e) {
		this.date[type].val = e.target.value;
		if (this.date.start.val && this.date.end.val) {
			this.isClearFilter = true
			this.loadPackagesList()
		}
	}


	refresh() {
		this.loadPackagesList()
		this.filterBy.control.setValue(undefined)
		this.filterByStatus.control.setValue(undefined)
		this.date.start.control.setValue(undefined)
		this.date.end.control.setValue(undefined)
		this.searchInput.nativeElement.value = "";
		this.placeHolderSearch = "*Select Category"
		this.valueFiltered.category.setValue(undefined)
		this.valueFiltered.status.setValue(undefined)
		this.isClearFilter = false
		this.isSearch = false
	}

	clearAllFilter() {
		this.filterBy.control.setValue(undefined)
		this.filterByStatus.control.setValue(undefined)
		this.date.start.control.setValue(undefined)
		this.date.end.control.setValue(undefined)
		this.searchInput.nativeElement.value = "";
		this.placeHolderSearch = "*Select Category"
		this.valueFiltered.category.setValue(undefined)
		this.valueFiltered.status.setValue(undefined)
		this.isSearch = false
		this.isClearFilter = false
		this.loadPackagesList()
		this.cdr.markForCheck()
	}

	deletePackages(_item: PackagesModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Package Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this package?';
		const _waitDesciption = 'Package deleting...';
		const _deleteMessage = `Package has been deleted`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			// this.store.dispatch(new PackagesDeleted({ }));
			const deleteFlag = this.service.deletePackagesNew(_item._id).subscribe()
			this.subscriptions.push(deleteFlag);
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadPackagesList();
			this.cdr.markForCheck()
		});
	}

	editPackages(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	viewPackages(id) {
		this.router.navigate(['view', id], { relativeTo: this.activatedRoute });
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	export() {
		this.service.exportExcel();
	}
}
