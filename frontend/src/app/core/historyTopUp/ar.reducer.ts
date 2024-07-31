// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { HistoryTopUpActions, HistoryTopUpActionTypes } from './ar.action';
// CRUD

// Models
import { HistoryTopUpModel } from './ar.model';
import { QueryHistoryTopUpModel } from './queryar.model';

// tslint:disable-next-line:no-empty-interface
export interface HistoryTopUpState extends EntityState<HistoryTopUpModel> {
	listLoading: boolean;
	actionsloading: boolean;
	totalCount: number;
	lastCreatedHistoryTopUpId: string;
	lastQuery: QueryHistoryTopUpModel;
	showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<HistoryTopUpModel> = createEntityAdapter<HistoryTopUpModel>(
	{ selectId: model => model._id, }
);

export const initialHistoryTopUpState: HistoryTopUpState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	totalCount: 0,
	lastQuery: new QueryHistoryTopUpModel({}),
	lastCreatedHistoryTopUpId: undefined,
	showInitWaitingMessage: true
});

export function historytopupReducer(state = initialHistoryTopUpState, action: HistoryTopUpActions): HistoryTopUpState {
	switch (action.type) {
		case HistoryTopUpActionTypes.HistoryTopUpPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedHistoryTopUpId: undefined
		};
		case HistoryTopUpActionTypes.HistoryTopUpActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case HistoryTopUpActionTypes.HistoryTopUpOnServerCreated: return {
			...state
		};
		case HistoryTopUpActionTypes.HistoryTopUpCreated: return adapter.addOne(action.payload.historytopup, {
			...state, lastCreatedBlockId: action.payload.historytopup._id
		});
		case HistoryTopUpActionTypes.HistoryTopUpUpdated: return adapter.updateOne(action.payload.phistorytopuptialHistoryTopUp, state);
		case HistoryTopUpActionTypes.HistoryTopUpDeleted: return adapter.removeOne(action.payload.id, state);
		case HistoryTopUpActionTypes.HistoryTopUpPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryHistoryTopUpModel({})
		};
		case HistoryTopUpActionTypes.HistoryTopUpPageLoaded: {
			return adapter.addMany(action.payload.historytopup, {
				...initialHistoryTopUpState,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getHistoryTopUpState = createFeatureSelector<HistoryTopUpState>('historytopup');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
