// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { HistoryTopUpModel } from './ar.model';
import { QueryHistoryTopUpModel } from './queryar.model';
// Models

export enum HistoryTopUpActionTypes {
	AllUsersRequested = '[HistoryTopUp Module] All HistoryTopUp Requested',
	AllUsersLoaded = '[HistoryTopUp API] All HistoryTopUp Loaded',
	HistoryTopUpOnServerCreated = '[Edit HistoryTopUp Component] HistoryTopUp On Server Created',
	HistoryTopUpCreated = '[Edit HistoryTopUp Dialog] HistoryTopUp Created',
	HistoryTopUpUpdated = '[Edit HistoryTopUp Dialog] HistoryTopUp Updated',
	HistoryTopUpDeleted = '[HistoryTopUp List Page] HistoryTopUp Deleted',
	HistoryTopUpPageRequested = '[HistoryTopUp List Page] HistoryTopUp Page Requested',
	HistoryTopUpPageLoaded = '[HistoryTopUp API] HistoryTopUp Page Loaded',
	HistoryTopUpPageCancelled = '[HistoryTopUp API] HistoryTopUp Page Cancelled',
	HistoryTopUpPageToggleLoading = '[HistoryTopUp] HistoryTopUp Page Toggle Loading',
	HistoryTopUpActionToggleLoading = '[HistoryTopUp] HistoryTopUp Action Toggle Loading'
}
export class HistoryTopUpOnServerCreated implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpOnServerCreated;
	constructor(public payload: { historytopup: HistoryTopUpModel }) { }
}

export class HistoryTopUpCreated implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpCreated;
	constructor(public payload: { historytopup: HistoryTopUpModel }) { }
}


export class HistoryTopUpUpdated implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpUpdated;
	constructor(public payload: {
		phistorytopuptialHistoryTopUp: Update<HistoryTopUpModel>,
		historytopup: HistoryTopUpModel
	}) { }
}

export class HistoryTopUpDeleted implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpDeleted;

	constructor(public payload: { id: string }) { }
}

export class HistoryTopUpPageRequested implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpPageRequested;
	constructor(public payload: { page: QueryHistoryTopUpModel }) { }
}

export class HistoryTopUpPageLoaded implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpPageLoaded;
	constructor(public payload: { historytopup: HistoryTopUpModel[], totalCount: number, page: QueryHistoryTopUpModel }) { }
}


export class HistoryTopUpPageCancelled implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpPageCancelled;
}

export class HistoryTopUpPageToggleLoading implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class HistoryTopUpActionToggleLoading implements Action {
	readonly type = HistoryTopUpActionTypes.HistoryTopUpActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export type HistoryTopUpActions = HistoryTopUpCreated
	| HistoryTopUpUpdated
	| HistoryTopUpDeleted
	| HistoryTopUpOnServerCreated
	| HistoryTopUpPageLoaded
	| HistoryTopUpPageCancelled
	| HistoryTopUpPageToggleLoading
	| HistoryTopUpPageRequested
	| HistoryTopUpActionToggleLoading;
