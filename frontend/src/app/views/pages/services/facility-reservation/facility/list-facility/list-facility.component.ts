import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../../core/_base/crud';

import { FacilityModel } from '../../../../../../core/services/facility-reservation/facility/facility.model';
import { FacilityDeleted, FacilityPageRequested } from '../../../../../../core/services/facility-reservation/facility/facility.action';
import { FacilityDataSource } from '../../../../../../core/services/facility-reservation/facility/facility.datasource';
import { SubheaderService } from '../../../../../../core/_base/layout';
import { FacilityService } from '../../../../../../core/services/facility-reservation/facility/facility.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../../../../environments/environment';
import { QueryFacilityModel } from '../../../../../../core/services/facility-reservation/facility/queryfacility.model';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'kt-list-facility',
	templateUrl: './list-facility.component.html',
	styleUrls: ['./list-facility.component.scss']
})
export class ListFacilityComponent implements OnInit, OnDestroy {
	file;
	dataSource: FacilityDataSource;
	displayedColumns = [
		'code',
		'cdunt',
		'facility',
		'date',
		'time',
		'checkIn',
		'status',
		'quota',
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
		{ name: "Nama Fasilitas", value: "facilityName", },
	]

	filterStatusDelivery: any = [
		{ name: "Open", value: "open", },
		{ name: "Closed", value: "closed", },
	]


	isSearch: boolean = false
	placeHolderSearch = "*pilih kategori"

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<FacilityModel>(true, []);
	facilityResult: FacilityModel[] = [];
	data = localStorage.getItem("currentUser");
	dataUser = JSON.parse(this.data)
	role = this.dataUser.role
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: FacilityService,
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
				this.loadFacilityList();
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
				this.loadFacilityList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Reservasi Fasilitas');

		// Init DataSource
		this.dataSource = new FacilityDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(
			res => {
				this.facilityResult = res;
			},
			err => {
				alert('error');
			}
		);
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadFacilityList();
	}

	filterConfiguration(): any {
		const filter: any = {};
		// filter.unit2 = `${searchText}`;
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();

		filter.category = this.valueFiltered.category.value ? this.valueFiltered.category.value : "";
		filter.input = `${searchText}`;
		filter.reservationDate = this.date.start.control.value ? this.date.start.control.value : "";
		// filter.endDate = this.date.end.control.value ? this.date.end.control.value : "";
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
		} else if (e === "facilityName") {
			this.placeHolderSearch = "Nama Fasilitas"
			this.valueFiltered.category.setValue(e)
			this.isSearch = true
		}
		this.loadFacilityList()
	}
	valueChooseStatus(e: string) {
		this.valueFiltered.status.setValue(e)
		this.isClearFilter = true
		this.loadFacilityList()
	}
	// Value choose category END

	loadFacilityList() {
		this.selection.clear();
		const queryParams = new QueryFacilityModel(
			this.filterConfiguration(),
			this.paginator.pageIndex + 1,
			this.paginator.pageSize
		);
		this.store.dispatch(new FacilityPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	addDate(type, e) {
		this.date[type].val = e.target.value;
		this.isClearFilter = true
		this.loadFacilityList()
	}

	changeStatus(value) {
		if (value === "wait-confirm") return "Waiting For Confirmation"
		else if (value === "done-confirm") return "Confirmed"
		else if (value === "done") return "Done"
		else return value
	}


	refresh() {
		this.loadFacilityList()
		this.filterBy.control.setValue(undefined)
		this.filterByStatus.control.setValue(undefined)
		this.date.start.control.setValue(undefined)
		this.date.end.control.setValue(undefined)
		this.searchInput.nativeElement.value = "";
		this.placeHolderSearch = "*pilih kategori"
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
		this.placeHolderSearch = "*pilih kategori"
		this.valueFiltered.category.setValue(undefined)
		this.valueFiltered.status.setValue(undefined)
		this.isSearch = false
		this.isClearFilter = false
		this.loadFacilityList()
		this.cdr.markForCheck()
	}

	deleteFacility(_item: FacilityModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'facility Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this facility?';
		const _waitDesciption = 'facility deleting...';
		const _deleteMessage = `facility has been deleted`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			// this.store.dispatch(new FacilityDeleted({ }));
			// const deleteFlag = this.service.deleteFacilityNew(_item._id).subscribe()

			this.service.deleteFacilityReservation(_item._id).subscribe(res => {
				if (res) this.loadFacilityList()
			})

			// this.subscriptions.push(deleteFlag);
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.cdr.markForCheck()
		});
	}

	editFacility(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	viewFacility(id) {
		this.router.navigate(['view', id], { relativeTo: this.activatedRoute });
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	export() {
		this.service.exportExcel();
	}
}
