// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel } from '../_base/crud';
// Services
import { HistoryTopUpService } from './ar.service';
// State
import { AppState } from '../reducers';
import {
	HistoryTopUpActionTypes,
	HistoryTopUpPageRequested,
	HistoryTopUpPageLoaded,
	HistoryTopUpCreated,
	HistoryTopUpDeleted,
	HistoryTopUpUpdated,
	HistoryTopUpOnServerCreated,
	HistoryTopUpActionToggleLoading,
	HistoryTopUpPageToggleLoading
} from './ar.action';
import { QueryHistoryTopUpModel } from './queryar.model';


@Injectable()
export class HistoryTopUpEffect {
	showPageLoadingDistpatcher = new HistoryTopUpPageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new HistoryTopUpPageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new HistoryTopUpActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new HistoryTopUpActionToggleLoading({ isLoading: false });

	@Effect()
	loadHistoryTopUpPage$ = this.actions$
		.pipe(
			ofType<HistoryTopUpPageRequested>(HistoryTopUpActionTypes.HistoryTopUpPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.historytopup.getListHistoryTopUp(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				let res: { errorMessage: string; totalCount: any; items: any };
				const result: QueryResultsModel = { items: response[0].data, totalCount: response[0].totalCount, errorMessage: "", data: [] };
				const lastQuery: QueryHistoryTopUpModel = response[1];
				return new HistoryTopUpPageLoaded({
					historytopup: result.items,
					totalCount: result.totalCount,
					page: lastQuery
				});
			}),
		);
	@Effect()
	deleteHistoryTopUp$ = this.actions$
		.pipe(
			ofType<HistoryTopUpDeleted>(HistoryTopUpActionTypes.HistoryTopUpDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.historytopup.deleteHistoryTopUp(payload.id);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	updateHistoryTopUp = this.actions$
		.pipe(
			ofType<HistoryTopUpUpdated>(HistoryTopUpActionTypes.HistoryTopUpUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.historytopup.updateHistoryTopUp(payload.historytopup);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	createBlock$ = this.actions$
		.pipe(
			ofType<HistoryTopUpOnServerCreated>(HistoryTopUpActionTypes.HistoryTopUpOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.historytopup.createHistoryTopUp(payload.historytopup).pipe(
					tap(res => {
						this.store.dispatch(new HistoryTopUpCreated({ historytopup: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	constructor(private actions$: Actions, private historytopup: HistoryTopUpService, private store: Store<AppState>) { }
}
