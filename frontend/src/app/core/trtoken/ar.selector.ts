// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../_base/crud';
// State
import { ArState } from './ar.reducer';
import { each } from 'lodash';
import { ArModel } from './ar.model';


export const selectArState = createFeatureSelector<ArState>('ar');

export const selectArById = (arId: string) => createSelector(
	selectArState,
	arState => arState.entities[arId]
);

export const selectArPageLoading = createSelector(
	selectArState,
	arState => {
		return arState.listLoading;
	}
);

export const selectArActionLoading = createSelector(
	selectArState,
	arState => arState.actionsloading
);

export const selectLastCreatedArId = createSelector(
	selectArState,
	arState => arState.lastCreatedArId
);

export const selectArPageLastQuery = createSelector(
	selectArState,
	arState => arState.lastQuery
);

export const selectArInStore = createSelector(
	selectArState,
	arState => {
		const items: ArModel[] = [];
		each(arState.entities, element => {
			items.push(element);
		});
		const httpExtension = new HttpExtenstionsModel();
		const result: ArModel[] = httpExtension.sortArray(items, arState.lastQuery.sortField, arState.lastQuery.sortOrder);
		return new QueryResultsModel(result, arState.totalCount, '');
	}
);

export const selectArShowInitWaitingMessage = createSelector(
	selectArState,
	arState => arState.showInitWaitingMessage
);

export const selectHasArInStore = createSelector(
	selectArState,
	queryResult => {
		if (!queryResult.totalCount) {
			return false;
		}

		return true;
	}
);
