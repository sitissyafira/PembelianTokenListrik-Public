// Angular
import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
// CRUD
import { QueryResultsModelUpd } from '../models/query-models/query-results.model';
import { QueryParamsModelUpd } from '../models/query-models/query-params.model';
import { HttpExtenstionsModelUpd } from '../models/http-extentsions-model';

@Injectable()
export class HttpUtilsServiceUpd {
	/**
	 * Prepare query http params
	 * @param queryParams: QueryParamsModelUpd
	 */
	getFindHTTPParams(queryParams): HttpParams {
		const params = new HttpParams()
			.set('lastNamefilter', queryParams.filter)
			.set('sortOrder', queryParams.sortOrder)
			.set('sortField', queryParams.sortField)
			.set('pageNumber', queryParams.pageNumber.toString())
			.set('pageSize', queryParams.pageSize.toString());

		return params;
	}

	/**
	 * get standard content-type
	 */
	getHTTPHeaders(): HttpHeaders {
		const result = new HttpHeaders();
		result.set('Content-Type', 'application/json');
		return result;
	}

	baseFilter(_entities: any[], _queryParams: QueryParamsModelUpd, _filtrationFields: string[] = []): QueryResultsModelUpd {
		const httpExtention = new HttpExtenstionsModelUpd();
		return httpExtention.baseFilter(_entities, _queryParams, _filtrationFields);
	}

	sortArray(_incomingArray: any[], _sortField: string = '', _sortOrder: string = 'asc'): any[] {
		const httpExtention = new HttpExtenstionsModelUpd();
		return httpExtention.sortArray(_incomingArray, _sortField, _sortOrder);
	}

	searchInArray(_incomingArray: any[], _queryObj: any, _filtrationFields: string[] = []): any[] {
		const httpExtention = new HttpExtenstionsModelUpd();
		return httpExtention.searchInArray(_incomingArray, _queryObj, _filtrationFields);
	}
}

