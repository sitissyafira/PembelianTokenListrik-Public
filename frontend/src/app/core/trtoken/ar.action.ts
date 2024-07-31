// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { ArModel } from './ar.model';
import { QueryArModel } from './queryar.model';
// Models

export enum ArActionTypes {
	AllUsersRequested = '[Ar Module] All Ar Requested',
	AllUsersLoaded = '[Ar API] All Ar Loaded',
	ArOnServerCreated = '[Edit Ar Component] Ar On Server Created',
	ArCreated = '[Edit Ar Dialog] Ar Created',
	ArUpdated = '[Edit Ar Dialog] Ar Updated',
	ArDeleted = '[Ar List Page] Ar Deleted',
	ArPageRequested = '[Ar List Page] Ar Page Requested',
	ArPageLoaded = '[Ar API] Ar Page Loaded',
	ArPageCancelled = '[Ar API] Ar Page Cancelled',
	ArPageToggleLoading = '[Ar] Ar Page Toggle Loading',
	ArActionToggleLoading = '[Ar] Ar Action Toggle Loading'
}
export class ArOnServerCreated implements Action {
	readonly type = ArActionTypes.ArOnServerCreated;
	constructor(public payload: { ar: ArModel }) { }
}

export class ArCreated implements Action {
	readonly type = ArActionTypes.ArCreated;
	constructor(public payload: { ar: ArModel }) { }
}


export class ArUpdated implements Action {
	readonly type = ArActionTypes.ArUpdated;
	constructor(public payload: {
		partialAr: Update<ArModel>,
		ar: ArModel
	}) { }
}

export class ArDeleted implements Action {
	readonly type = ArActionTypes.ArDeleted;

	constructor(public payload: { id: string }) { }
}

export class ArPageRequested implements Action {
	readonly type = ArActionTypes.ArPageRequested;
	constructor(public payload: { page: QueryArModel }) { }
}

export class ArPageLoaded implements Action {
	readonly type = ArActionTypes.ArPageLoaded;
	constructor(public payload: { ar: ArModel[], totalCount: number, page: QueryArModel }) { }
}


export class ArPageCancelled implements Action {
	readonly type = ArActionTypes.ArPageCancelled;
}

export class ArPageToggleLoading implements Action {
	readonly type = ArActionTypes.ArPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class ArActionToggleLoading implements Action {
	readonly type = ArActionTypes.ArActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export type ArActions = ArCreated
	| ArUpdated
	| ArDeleted
	| ArOnServerCreated
	| ArPageLoaded
	| ArPageCancelled
	| ArPageToggleLoading
	| ArPageRequested
	| ArActionToggleLoading;
