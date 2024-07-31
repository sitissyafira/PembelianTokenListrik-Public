// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../_base/crud';
// State
import { AppState } from '../reducers';
import { selectHistoryTopUpInStore, selectHistoryTopUpPageLoading, selectHistoryTopUpShowInitWaitingMessage } from './ar.selector';


export class HistoryTopUpDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectHistoryTopUpPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectHistoryTopUpShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectHistoryTopUpInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
