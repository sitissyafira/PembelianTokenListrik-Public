import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HistoryTopUpModel } from './ar.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { QueryResultsModel } from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryHistoryTopUpModel } from './queryar.model';
import { query } from 'chartist';

const API_BASE = `${environment.baseAPI}/api/accreceive`;
const API_CSV = `${environment.baseAPI}/api/excel/trtoken/export`;
const API_HISTORY_TRANSAKSI = `${environment.baseAPI}/api/historytoken`
const API_TRANSAKSI = `${environment.baseAPI}/api/trantopup`;


@Injectable({
	providedIn: 'root'
})
export class HistoryTopUpService {
	constructor(private http: HttpClient) { }
	// get list block group
	getListHistoryTopUp(queryParams: QueryHistoryTopUpModel): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		let params = new URLSearchParams();
		let options = {
			phistorytopupam: JSON.stringify(queryParams)
		}
		for (let key in options) {
			params.set(key, options[key]);
		}

		console.log(queryParams);

		const sehistorytopupch = queryParams.filter


		return this.http.get<QueryResultsModel>(`${API_HISTORY_TRANSAKSI}/gethistory/date?fromDate=${queryParams.fromDate}&toDate=${queryParams.toDate}&page=${queryParams.pageNumber}&limit=${queryParams.limit}`, { headers: httpHeaders });
	}


	findHistoryTopUpById(_id: string): Observable<HistoryTopUpModel> {
		return this.http.get<HistoryTopUpModel>(`${API_BASE}/${_id}`);
	}

	deleteHistoryTopUp(historytopupId: string) {
		const url = `${API_TRANSAKSI}/delete/${historytopupId}`;
		return this.http.delete(url);
	}
	updateHistoryTopUp(historytopup: HistoryTopUpModel) {
		const url = `${API_BASE}/edit/${historytopup._id}`;
		return this.http.patch(url, historytopup);
	}

	getPrintTransaksi(_id: string): Observable<any> {
		return this.http.get<any>(`${API_TRANSAKSI}/get/print/${_id}`);
	}

	createHistoryTopUp(historytopup: HistoryTopUpModel): Observable<HistoryTopUpModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<HistoryTopUpModel>(`${API_BASE}/add`, historytopup, { headers: httpHeaders });
	}

	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}


	exportExcel(): Observable<QueryResultsModel> {
		return FileSaver.saveAs(`${API_CSV}`, "export-historytopup.xlsx");
	}

}
