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

import { RoleModel } from '../../../../core/role/role.model';
import { RoleDeleted, RolePageRequested} from '../../../../core/role/role.action';
import {RoleDataSource} from '../../../../core/role/role.datasource';
import {SubheaderService} from '../../../../core/_base/layout';
import {RoleService} from '../../../../core/role/role.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryRoleModel } from '../../../../core/role/queryrole.model';

@Component({
  selector: 'kt-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListUnittypeComponent implements OnInit, OnDestroy {
	file;
	dataSource: RoleDataSource;
	displayedColumns = [ 
		// 'roleCode', 
		'role', 'active', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<RoleModel>(true, []);
	roleResult: RoleModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: RoleService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		private http : HttpClient,
		private modalService : NgbModal
	) { }

  	ngOnInit() {
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadRoleList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);


		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadRoleList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Role');

		// Init DataSource
		this.dataSource = new RoleDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.roleResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadRoleList();
  	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();

		filter.role = `${searchText}`;
		return filter;
	}

	loadRoleList(){
		this.selection.clear();
		const queryParams = new QueryRoleModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new RolePageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deleteRole(_item: RoleModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Role Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this role?';
		const _waitDesciption = 'Role is deleting...';
		const _deleteMessage = `Role has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new RoleDeleted({ id: _item._id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.roleResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.roleResult.length) {
			this.selection.clear();
		} else {
			this.roleResult.forEach(row => this.selection.select(row));
		}
	}

	editRole(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	viewRole(id) {
		this.router.navigate(['view', id], { relativeTo: this.activatedRoute });
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	export(){
		this.service.exportExcel();
	}

	
}
