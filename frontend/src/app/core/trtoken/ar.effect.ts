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
import { ArService } from './ar.service';
// State
import { AppState } from '../../core/reducers';
import {
	ArActionTypes,
	ArPageRequested,
	ArPageLoaded,
	ArCreated,
	ArDeleted,
	ArUpdated,
	ArOnServerCreated,
	ArActionToggleLoading,
	ArPageToggleLoading
} from './ar.action';
import { QueryArModel } from './queryar.model';


@Injectable()
export class ArEffect {
	showPageLoadingDistpatcher = new ArPageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new ArPageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new ArActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new ArActionToggleLoading({ isLoading: false });

	@Effect()
	loadArPage$ = this.actions$
		.pipe(
			ofType<ArPageRequested>(ArActionTypes.ArPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.ar.getListAr(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				let res: { errorMessage: string; totalCount: any; items: any };
				const result: QueryResultsModel = { items: response[0].data, totalCount: response[0].totalCount, errorMessage: "", data: [] };
				const lastQuery: QueryArModel = response[1];
				return new ArPageLoaded({
					ar: result.items,
					totalCount: result.totalCount,
					page: lastQuery
				});
			}),
		);
	@Effect()
	deleteAr$ = this.actions$
		.pipe(
			ofType<ArDeleted>(ArActionTypes.ArDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.ar.deleteAr(payload.id);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	updateAr = this.actions$
		.pipe(
			ofType<ArUpdated>(ArActionTypes.ArUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.ar.updateAr(payload.ar);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	createBlock$ = this.actions$
		.pipe(
			ofType<ArOnServerCreated>(ArActionTypes.ArOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.ar.createAr(payload.ar).pipe(
					tap(res => {
						this.store.dispatch(new ArCreated({ ar: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	constructor(private actions$: Actions, private ar: ArService, private store: Store<AppState>) { }
}
