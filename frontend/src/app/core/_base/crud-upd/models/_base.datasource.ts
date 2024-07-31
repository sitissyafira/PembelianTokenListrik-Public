// Angular
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
// RxJS
import { Observable, BehaviorSubject, combineLatest, Subscription, of } from 'rxjs';
// CRUD
import { HttpExtenstionsModelUpd } from './http-extentsions-model';
import { QueryParamsModelUpd } from './query-models/query-params.model';
import { QueryResultsModelUpd } from './query-models/query-results.model';
import { BaseModelUpd } from './_base.model';
import { skip, distinctUntilChanged } from 'rxjs/operators';

// Why not use MatTableDataSource?
/*  In this example, we will not be using the built-in MatTableDataSource because its designed for filtering,
	sorting and pagination of a client - side data array.
	Read the article: 'https://blog.angular-university.io/angular-material-data-table/'
**/
export class BaseDataSourceUpd implements DataSource<BaseModelUpd> {
	entitySubject = new BehaviorSubject<any[]>([]);
	hasItems = true; // Need to show message: 'No records found'

	// Loading | Progress bar
	loading$: Observable<boolean>;
	isPreloadTextViewed$: Observable<boolean> = of(true);

	// Paginator | Paginators count
	paginatorTotalSubject = new BehaviorSubject<number>(0);
	paginatorTotal$: Observable<number>;
	allTotalSubject = new BehaviorSubject<number>(0);
	allTotal$: Observable<number>;
	subscriptions: Subscription[] = [];

	constructor() {
		this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();
		this.allTotal$ = this.allTotalSubject.asObservable();
		// subscribe hasItems to (entitySubject.length==0)
		const hasItemsSubscription = this.paginatorTotal$.pipe(
			distinctUntilChanged(),
			skip(1)
		).subscribe(res => this.hasItems = res > 0);
		this.subscriptions.push(hasItemsSubscription);

		this.allTotal$ = this.allTotalSubject.asObservable();
	}

	connect(collectionViewer: CollectionViewer): Observable<any[]> {
		// Connecting data source
		return this.entitySubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		// Disonnecting data source
		this.entitySubject.complete();
		this.paginatorTotalSubject.complete();
		this.allTotalSubject.complete();
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	baseFilter(_entities: any[], _queryParams: QueryParamsModelUpd, _filtrationFields: string[] = []): QueryResultsModelUpd {
		const httpExtention = new HttpExtenstionsModelUpd();
		return httpExtention.baseFilter(_entities, _queryParams, _filtrationFields);
	}

	sortArray(_incomingArray: any[], _sortField: string = '', _sortOrder: string = 'asc'): any[] {
		const httpExtention = new HttpExtenstionsModelUpd();
		return httpExtention.sortArray(_incomingArray, _sortField, _sortOrder);
	}

	searchInArray(_incomingArray: any[], _queryObj: any, _filtrationFields: string[] = []): any[] {
		const httpExtention = new HttpExtenstionsModelUpd();
		return httpExtention.searchInArray(_incomingArray, _queryObj, _filtrationFields);
	}
}

