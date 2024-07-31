import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
import { VisitorModel } from '../../../../../core/services/visitor/visitor.model';
import { VisitorDeleted, VisitorPageRequested } from '../../../../../core/services/visitor/visitor.action';
import { VisitorDataSource } from '../../../../../core/services/visitor/visitor.datasource';
import { SubheaderService } from '../../../../../core/_base/layout';
import { VisitorService } from '../../../../../core/services/visitor/visitor.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryVisitorModel } from '../../../../../core/services/visitor/queryvisitor.model';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { ModuleVisitor } from '../../../../../core/services/visitor/module/moduleservice';

@Component({
	selector: 'kt-list-visitor',
	templateUrl: './list-visitor.component.html',
	styleUrls: ['./list-visitor.component.scss']
})
export class ListVisitorComponent implements OnInit, OnDestroy {
	file;
	dataSource: VisitorDataSource;
	displayedColumns = [
		'read',
		'unit',
		'tanggal',
		'jam',
		'nama',
		'guestId',
		'status',
		'cIN',
		'cOUT',
		'actions'
	];

	// Date filter 
	dateVisit = {
		valid: false,
		control: new FormControl()
	};
	loading = false;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<VisitorModel>(true, []);
	visitorResult: VisitorModel[] = [];
	data = localStorage.getItem("currentUser");
	dataUser = JSON.parse(this.data)
	role = this.dataUser.role

	isClearFilter: boolean = false

	valueFiltered = { category: new FormControl(), status: new FormControl() }

	isSearch: boolean = false
	placeHolderSearch = "*Select Category"

	filterBy = {
		control: new FormControl(),
		val: undefined
	}
	filterByStatus = {
		control: new FormControl(),
		val: undefined
	}


	filterCategory: any = [
		{ name: "Unit", value: "unit", },
		{ name: "Visitor Name", value: "visitorname", },
	]

	filterStatusDelivery: any = [
		{ name: "Waiting For Confirmation", value: "wait-confirm", },
		{ name: "Approve", value: "approve", },
		{ name: "Check In", value: "check-in", },
		{ name: "Check Out", value: "check-out", },
		{ name: "Reject By Customer", value: "reject-by-mob", },
		{ name: "Cancel By Customer", value: "cancel-by-mob", },
		{ name: "Cancel By Admin", value: "cancel-by-web", },
	]

	// Date filter
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


	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private moduleVisitor: ModuleVisitor, // services for flow visitor systems (ex: changeStatus > to change status, etc.)
		private store: Store<AppState>,
		private router: Router,
		private service: VisitorService,
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
				this.loadVisitorList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(500),
			distinctUntilChanged(),
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadVisitorList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);
		this.subheaderService.setTitle('Visitor Management');
		this.dataSource = new VisitorDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(
			res => {
				this.visitorResult = res;
			},
			err => {
				alert('error');
			}
		);
		this.subscriptions.push(entitiesSubscription);
		this.loadVisitorList();
	}

	addDate(type, e) {
		this.date[type].val = moment(e.target.value).format("YYYY/MM/DD");
		if (this.date.start.val && this.date.end.val) {
			this.isClearFilter = true
			this.loadVisitorList()
		}
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
		} else if (e === "visitorname") {
			this.placeHolderSearch = "Visitor Name"
			this.valueFiltered.category.setValue(e)
			this.isSearch = true
		}
		this.loadVisitorList()
	}

	valueChooseStatus(e: string) {
		this.isClearFilter = true
		this.valueFiltered.status.setValue(e)
		this.loadVisitorList()
	}
	// Value choose category END

	clearAllFilter() {
		this.filterBy.control.setValue(undefined)
		this.filterByStatus.control.setValue(undefined)
		this.searchInput.nativeElement.value = "";
		this.placeHolderSearch = "*Select Category"
		this.valueFiltered.category.setValue(undefined)
		this.valueFiltered.status.setValue(undefined)
		this.isSearch = false
		this.isClearFilter = false

		this.date.start.control.setValue(undefined)
		this.date.end.control.setValue(undefined)

		this.loadVisitorList()
		this.cdr.markForCheck()
	}

	loadVisitorList() {
		this.setLoading(true);
		this.selection.clear();
		const queryParams = new QueryVisitorModel(
			this.filterConfiguration(),
			// this.date.start,
			// this.date.end,
			this.paginator.pageSize,
			this.paginator.pageIndex + 1,
		);
		this.store.dispatch(new VisitorPageRequested({ page: queryParams }));
		this.selection.clear();

		// Delay button for 1.5 sec
		setTimeout(() => {
			this.setLoading(false);
		}, 1500);
	}

	deleteVisitor(_item: VisitorModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Visitor Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this visitor?';
		const _waitDesciption = 'Visitor is deleting...';
		const _deleteMessage = `Visitor has been deleted`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			// this.store.dispatch(new VisitorDeleted({ id: _item._id }));
			const deleted = this.service.deleteVisitor(_item._id).subscribe()
			// const deleteFlag = this.service.deleteFlagPackages(_item).subscribe()
			// this.subscriptions.push(deleteFlag);
			this.subscriptions.push(deleted);
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			setTimeout(() => {
				this.loadVisitorList();
			}, 500);
		});
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

	refresh() {
		this.loadVisitorList()
	}

	editVisitor(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	viewVisitor(id) {
		this.router.navigate(['view', id], { relativeTo: this.activatedRoute });
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	setLoading(status: boolean) {
		this.loading = status;
		this.cdr.markForCheck();
	}

	export() {
		this.service.exportExcel();
	}
}
