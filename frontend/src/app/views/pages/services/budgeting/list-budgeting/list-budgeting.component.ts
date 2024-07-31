
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';

import { BudgetingModel } from '../../../../../core/services/budgeting/budgeting.model';
import { BudgetingDeleted, BudgetingPageRequested } from '../../../../../core/services/budgeting/budgeting.action';
import { BudgetingDataSource } from '../../../../../core/services/budgeting/budgeting.datasource';
import { SubheaderService } from '../../../../../core/_base/layout';
import { BudgetingService } from '../../../../../core/services/budgeting/budgeting.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../../../environments/environment';
import { QueryBudgetingModel } from '../../../../../core/services/budgeting/querybudgeting.model';

@Component({
	selector: 'kt-list-budgeting',
	templateUrl: './list-budgeting.component.html',
	styleUrls: ['./list-budgeting.component.scss']
})
export class ListBudgetingComponent implements OnInit, OnDestroy {
	file;
	dataSource: BudgetingDataSource;
	displayedColumns = [
		'acctNo',
		'acctName',
		'year' ,
		'nominal_budget',
		'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<BudgetingModel>(true, []);
	budgetingResult: BudgetingModel[] = [];
	data = localStorage.getItem("currentUser");
	dataUser = JSON.parse(this.data)
	role = this.dataUser.role
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: BudgetingService,
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
				this.loadBudgetingList();
			})
		)
		.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(500), 
			distinctUntilChanged(), 
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadBudgetingList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);
		this.subheaderService.setTitle('Budget Management');
		this.dataSource = new BudgetingDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(
			res => {
			this.budgetingResult = res;
			}, 
			err => {
			alert('error');		
		}
		);
		this.subscriptions.push(entitiesSubscription);
		this.loadBudgetingList();
	}

	filterConfiguration(): any {
		const search: string = this.searchInput.nativeElement.value.toLowerCase();
		return search;
	}

	loadBudgetingList() {
		this.selection.clear();
		const queryParams = new QueryBudgetingModel(
			this.filterConfiguration(),
			this.paginator.pageIndex + 1,
			this.paginator.pageSize
		);
		this.store.dispatch(new BudgetingPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deleteBudgeting(_item: BudgetingModel) {
		console.log(_item)
		const _title = 'Package Delete';
		const _description = 'Are you sure to permanently delete this package?';
		const _waitDesciption = 'Package deleting...';
		const _deleteMessage = `Package has been deleted`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const deleteFlag = this.service.deleteFlagBudgeting(_item).subscribe()
			this.subscriptions.push(deleteFlag);
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadBudgetingList();
		});
	}

	editBudgeting(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	viewBudgeting(id) {
		this.router.navigate(['view', id], { relativeTo: this.activatedRoute });
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	export() {
		this.service.exportExcel();
	}
}
