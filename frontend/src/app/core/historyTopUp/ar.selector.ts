// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../_base/crud';
// State
import { HistoryTopUpState } from './ar.reducer';
import { each } from 'lodash';
import { HistoryTopUpModel } from './ar.model';


export const selectHistoryTopUpState = createFeatureSelector<HistoryTopUpState>('historytopup');

export const selectHistoryTopUpById = (historytopupId: string) => createSelector(
	selectHistoryTopUpState,
	historytopupState => historytopupState.entities[historytopupId]
);

export const selectHistoryTopUpPageLoading = createSelector(
	selectHistoryTopUpState,
	historytopupState => {
		return historytopupState.listLoading;
	}
);

export const selectHistoryTopUpActionLoading = createSelector(
	selectHistoryTopUpState,
	historytopupState => historytopupState.actionsloading
);

export const selectLastCreatedHistoryTopUpId = createSelector(
	selectHistoryTopUpState,
	historytopupState => historytopupState.lastCreatedHistoryTopUpId
);

export const selectHistoryTopUpPageLastQuery = createSelector(
	selectHistoryTopUpState,
	historytopupState => historytopupState.lastQuery
);

export const selectHistoryTopUpInStore = createSelector(
	selectHistoryTopUpState,
	historytopupState => {
		const items: HistoryTopUpModel[] = [];
		each(historytopupState.entities, element => {
			items.push(element);
		});
		const httpExtension = new HttpExtenstionsModel();
		const result: HistoryTopUpModel[] = httpExtension.sortArray(items, historytopupState.lastQuery.sortField, historytopupState.lastQuery.sortOrder);
		return new QueryResultsModel(result, historytopupState.totalCount, '');
	}
);

export const selectHistoryTopUpShowInitWaitingMessage = createSelector(
	selectHistoryTopUpState,
	historytopupState => historytopupState.showInitWaitingMessage
);

export const selectHasHistoryTopUpInStore = createSelector(
	selectHistoryTopUpState,
	queryResult => {
		if (!queryResult.totalCount) {
			return false;
		}

		return true;
	}
);
