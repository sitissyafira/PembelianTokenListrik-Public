import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../../core/_base/crud';

import { MasterModel } from '../../../../../../core/services/facility-reservation/master/master.model';
import { MasterDeleted, MasterPageRequested } from '../../../../../../core/services/facility-reservation/master/master.action';
import { MasterDataSource } from '../../../../../../core/services/facility-reservation/master/master.datasource';
import { SubheaderService } from '../../../../../../core/_base/layout';
import { MasterService } from '../../../../../../core/services/facility-reservation/master/master.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../../../../environments/environment';
import { QueryMasterModel } from '../../../../../../core/services/facility-reservation/master/querymaster.model';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'kt-list-master',
	templateUrl: './list-master.component.html',
	styleUrls: ['./list-master.component.scss']
})
export class ListMasterComponent implements OnInit, OnDestroy {
	file;
	dataSource: MasterDataSource;
	displayedColumns = [
		'master',
		'date',
		'start',
		'end',
		'quota',
		'reQuota',
		'status',
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

	filterStatusDelivery: any = [
		{ name: "Aktif", value: true, },
		{ name: "Tidak Aktif", value: false, },
	]


	placeHolderSearch = "*pilih kategori"

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<MasterModel>(true, []);
	masterResult: MasterModel[] = [];
	data = localStorage.getItem("currentUser");
	dataUser = JSON.parse(this.data)
	role = this.dataUser.role
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: MasterService,
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
				this.loadMasterList();
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
				this.loadMasterList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Setting Reservasi Fasilitas');

		// Init DataSource
		this.dataSource = new MasterDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(
			res => {
				this.masterResult = res;
			},
			err => {
				alert('error');
			}
		);
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadMasterList();
	}

	filterConfiguration(): any {
		const filter: any = {};
		// filter.unit2 = `${searchText}`;
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();

		filter.input = `${searchText}`;
		filter.date = this.date.start.control.value ? this.date.start.control.value : "";
		filter.active = this.valueFiltered.status.value === true ? true :
			this.valueFiltered.status.value === false ? false : "";

		return filter;
	}

	valueChooseStatus(e: string) {
		this.valueFiltered.status.setValue(e)
		this.isClearFilter = true
		this.loadMasterList()
	}
	// Value choose category END

	loadMasterList() {
		this.selection.clear();
		const queryParams = new QueryMasterModel(
			this.filterConfiguration(),
			this.paginator.pageIndex + 1,
			this.paginator.pageSize
		);
		this.store.dispatch(new MasterPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	addDate(type, e) {
		this.date[type].val = e.target.value;
		this.isClearFilter = true
		this.loadMasterList()
	}

	changeStatus(value) {
		if (value) return 'Aktif';
		else return 'Tidak Aktif';
	}


	refresh() {
		this.loadMasterList()
		this.filterBy.control.setValue(undefined)
		this.filterByStatus.control.setValue(undefined)
		this.date.start.control.setValue(undefined)
		this.date.end.control.setValue(undefined)
		this.searchInput.nativeElement.value = "";
		this.placeHolderSearch = "*pilih kategori"
		this.valueFiltered.category.setValue(undefined)
		this.valueFiltered.status.setValue(undefined)
		this.isClearFilter = false
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
		this.isClearFilter = false
		this.loadMasterList()
		this.cdr.markForCheck()
	}

	deleteMaster(_item: MasterModel) {
		// tslint:disable-next-line:variable-name 
		const _title = 'Master Master Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this master master?';
		const _waitDesciption = 'Master Master deleting...';
		const _deleteMessage = `Master Master has been deleted`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			// this.store.dispatch(new MasterDeleted({ }));
			const deleteMaster = this.service.deleteMasterMaster(_item._id).subscribe()
			this.subscriptions.push(deleteMaster);
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadMasterList();
			this.cdr.markForCheck()
		});
	}

	editMaster(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	viewMaster(id) {
		this.router.navigate(['view', id], { relativeTo: this.activatedRoute });
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	export() {
		this.service.exportExcel();
	}
}
