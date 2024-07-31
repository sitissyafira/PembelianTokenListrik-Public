// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';

//services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';

import { SubdefectModel } from '../../../../core/subdefect/subdefect.model';
import { SubdefectDeleted, SubdefectPageRequested} from '../../../../core/subdefect/subdefect.action';
import {SubdefectDataSource} from '../../../../core/subdefect/subdefect.datasource';
import {SubheaderService} from '../../../../core/_base/layout';
import {SubdefectService} from '../../../../core/subdefect/subdefect.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuerySubdefectModel } from '../../../../core/subdefect/querysubdefect.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'kt-list-subdefect',
  templateUrl: './list-subdefect.component.html',
  styleUrls: ['./list-subdefect.component.scss']
})
export class ListSubdefectComponent implements OnInit, OnDestroy {
	file;
	data = localStorage.getItem("currentUser");
	dataUser = JSON.parse(this.data)
	role = this.dataUser.role
	dataSource: SubdefectDataSource;
	displayedColumns = [ 'category','defect', 'subtype' , 'priority', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<SubdefectModel>(true, []);
	subdefectResult: SubdefectModel[] = [];
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: SubdefectService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		private http : HttpClient,
		private modalService : NgbModal
	) { }

  	ngOnInit() {
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadSubdefectList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions)
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(50), 
			distinctUntilChanged(),
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadSubdefectList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);
		this.subheaderService.setTitle('Defect');
		this.dataSource = new SubdefectDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.subdefectResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		this.loadSubdefectList();
  	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();
		filter.subtype = `${searchText}`;
		return filter;
	}

	loadSubdefectList(){
		this.selection.clear();
		const queryParams = new QuerySubdefectModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new SubdefectPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deleteSubdefect(_item: SubdefectModel) {
		const _title = 'Defect Delete';
		const _description = 'Are you sure to permanently delete this defect?';
		const _waitDesciption = 'Defect is deleting...';
		const _deleteMessage = `Defect has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.store.dispatch(new SubdefectDeleted({ id: _item._id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	editSubdefect(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	viewSubdefect(id) {
		this.router.navigate(['view', id], { relativeTo: this.activatedRoute });
	}


  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
