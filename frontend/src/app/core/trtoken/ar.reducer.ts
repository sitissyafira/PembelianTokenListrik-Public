// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { ArActions, ArActionTypes } from './ar.action';
// CRUD

// Models
import { ArModel } from './ar.model';
import { QueryArModel } from './queryar.model';

// tslint:disable-next-line:no-empty-interface
export interface ArState extends EntityState<ArModel> {
	listLoading: boolean;
	actionsloading: boolean;
	totalCount: number;
	lastCreatedArId: string;
	lastQuery: QueryArModel;
	showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ArModel> = createEntityAdapter<ArModel>(
	{ selectId: model => model._id, }
);

export const initialArState: ArState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	totalCount: 0,
	lastQuery: new QueryArModel({}),
	lastCreatedArId: undefined,
	showInitWaitingMessage: true
});

export function arReducer(state = initialArState, action: ArActions): ArState {
	switch (action.type) {
		case ArActionTypes.ArPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedArId: undefined
		};
		case ArActionTypes.ArActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case ArActionTypes.ArOnServerCreated: return {
			...state
		};
		case ArActionTypes.ArCreated: return adapter.addOne(action.payload.ar, {
			...state, lastCreatedBlockId: action.payload.ar._id
		});
		case ArActionTypes.ArUpdated: return adapter.updateOne(action.payload.partialAr, state);
		case ArActionTypes.ArDeleted: return adapter.removeOne(action.payload.id, state);
		case ArActionTypes.ArPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryArModel({})
		};
		case ArActionTypes.ArPageLoaded: {
			return adapter.addMany(action.payload.ar, {
				...initialArState,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getArState = createFeatureSelector<ArState>('ar');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
