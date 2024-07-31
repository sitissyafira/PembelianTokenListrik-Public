import { Component, ElementRef, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

//services
import { SubheaderService } from '../../../../../core/_base/layout';
import { BlastNotificationService } from '../blast-notification.service';

@Component({
  selector: 'kt-list-blast-notification',
  templateUrl: './list-blast-notification.component.html',
  styleUrls: ['./list-blast-notification.component.scss'],
})
export class ListBlastNotificationComponent implements OnInit, OnDestroy {

  dataSource = {
    totalCount: 0,
    hasItems: false,
    data: undefined,
    isError: false
  };
  displayedColumns = ['title', 
  // 'date', 'time', 
  'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  data = localStorage.getItem("currentUser");
	dataUser = JSON.parse(this.data)
	role = this.dataUser.role
  loading: boolean;

  // Subscriptions
  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private blastNotificationService: BlastNotificationService,
    private activeRoute: ActivatedRoute,
    private SubheaderService: SubheaderService,
    private cdr: ChangeDetectorRef
  ) { }

  // All event handlers
  _btnActionHandler(id: string, edit?: boolean) {
    if (edit) this.router.navigate(['duplicate', id], { relativeTo: this.activeRoute });
    else this.router.navigate(['detail', id], { relativeTo: this.activeRoute });
  }
  _btnActionDeleteHandler(id: string) {
    console.log('Delete clicked');
  }

  ngOnInit() {
    // Set breadcrumb title
    this.SubheaderService.setTitle('Blast News Notification');

    const sortSub = this.sort.sortChange.subscribe(() => () => (this.paginator.pageIndex = 0));
    this.subs.push(sortSub);

    const paginatorSub = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => {
        this.loadNotification();
      })
    ).subscribe();
    this.subs.push(paginatorSub);

    const searchSub = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((i) => {
        this.paginator.pageIndex = 0;
        this.loadNotification();
      })
    ).subscribe();
    this.subs.push(searchSub);

    this.loadNotification();
  }

  loadNotification() {
    this.setLoading(true);

    const getListNotifSub = this.blastNotificationService.getList({
      search: this.filterConfiguration(),
      page: this.paginator.pageIndex + 1,
      limit: this.paginator.pageSize
    }).subscribe(
      resp => {
        if (resp.status === 'success' && resp.data.length) {
          this.setDataSource(resp.data, resp.totalCount, true);
        } else {
          this.setDataSource([], 0, false);
        }
      },
      err => {
        this.setDataSource([], 0, false, true);
        console.log(err, 'something went wrong!');
      }
    );
  }

  filterConfiguration(): any {
    const search: string = this.searchInput.nativeElement.value.toLowerCase();
    return search;
  }

  setDataSource(data, total, hasData, isError?) {
    this.dataSource.data = data;
    this.dataSource.totalCount = total;
    this.dataSource.hasItems = hasData;

    if(isError) this.dataSource.isError = isError

    this.setLoading(false);
  }

  setLoading(val: boolean) {
    this.loading = val;
    this.cdr.markForCheck();
  }

  ngOnDestroy() {
    this.subs.map(s => s.unsubscribe());
  }
}
