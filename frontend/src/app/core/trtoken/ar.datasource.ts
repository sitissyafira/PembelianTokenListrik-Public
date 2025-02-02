// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../_base/crud';
// State
import { AppState } from '../../core/reducers';
import { selectArInStore, selectArPageLoading, selectArShowInitWaitingMessage } from './ar.selector';


export class ArDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectArPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectArShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectArInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
