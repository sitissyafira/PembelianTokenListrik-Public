import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ArModel } from './ar.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { QueryResultsModel } from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryArModel } from './queryar.model';
import { query } from 'chartist';

const API_BASE = `${environment.baseAPI}/api/accreceive`;
const API_CSV = `${environment.baseAPI}/api/excel/export`;
const API_GNR = `${environment.baseAPI}/api/trantopup`;

// start metode pembayaran
const API_TOKEN = `${environment.baseAPI}/api/tokenmaster`;
const API_TRANSAKSI = `${environment.baseAPI}/api/trantopup`;
const API_TRDETAIL = `${environment.baseAPI}/api/progress/trdetail`;
const API_PROGRESS = `${environment.baseAPI}/api/progress`;
// end metode pembayaran

@Injectable({
	providedIn: 'root'
})
export class ArService {
	constructor(private http: HttpClient) { }
	// get list block group
	getListAr(queryParams: QueryArModel): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		let params = new URLSearchParams();
		let options = {
			param: JSON.stringify(queryParams)
		}
		for (let key in options) {
			params.set(key, options[key]);
		}

		console.log(queryParams);

		const search = queryParams.filter


		return this.http.get<QueryResultsModel>(`${API_TRANSAKSI}/get/query?page=${queryParams.pageNumber}&limit=${queryParams.limit}&date=${queryParams.fromDate}&unit=${queryParams.filter}`, { headers: httpHeaders });
	}

	// unit token start
	getDataOrderan(queryParams: any): Observable<QueryResultsModel> {
		return this.http.get<any>(`${API_TOKEN}/list/all`);
	}
	findOrderanById(_id: string): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(`${API_TOKEN}/rttoken/${_id}`);
	}
	getCodeTransaksi(): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(`${API_TRANSAKSI}/get/cdtrans`);
	}
	getAllUnit(queryParams: any): Observable<QueryResultsModel> {
		return this.http.get<any>(`${API_TRANSAKSI}/get/unit`);
	}
	getMtdPembayaran(queryParams: any): Observable<QueryResultsModel> {
		return this.http.get<any>(`${API_TRANSAKSI}/get/paymtd`);
	}
	getBankTransfer(queryParams: any): Observable<QueryResultsModel> {
		return this.http.get<any>(`${API_TRANSAKSI}/get/banklist`);
	}
	createTransaksiToken(topup: any): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<any>(`${API_TRANSAKSI}/create`, topup, { headers: httpHeaders });
	}
	getDetailTransaksi(_id: string): Observable<any> {
		return this.http.get<any>(`${API_TRANSAKSI}/trdetail/${_id}`);
	}
	getProgressEngineer(_id: string): Observable<any> {
		console.log(_id);

		return this.http.get<any>(`${API_PROGRESS}/getProgress/${_id}`);
	}
	getPrintTransaksi(_id: string): Observable<any> {
		return this.http.get<any>(`${API_TRANSAKSI}/get/print/${_id}`);
	}
	getDataEngineer(): Observable<any> {
		return this.http.get<any>(`${API_TRANSAKSI}/get/engineer`);
	}
	updateDetailTransaksi(topup: any, _id: any): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		console.log(topup);
		console.log("testing");

		return this.http.patch<any>(`${API_TRDETAIL}/update/${_id}`, topup, { headers: httpHeaders });
	}
	// unit token end


	findArById(_id: string): Observable<ArModel> {
		return this.http.get<ArModel>(`${API_BASE}/${_id}`);
	}

	deleteAr(arId: string) {
		const url = `${API_TRANSAKSI}/delete/${arId}`;
		return this.http.delete(url);
	}

	updateAr(ar: ArModel) {
		const url = `${API_BASE}/edit/${ar._id}`;
		return this.http.patch(url, ar);
	}

	createAr(ar: ArModel): Observable<ArModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<ArModel>(`${API_BASE}/add`, ar, { headers: httpHeaders });
	}

	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}

	generateExcel(params): Observable<any> {

		const url = `${API_CSV}/topuptok?column=${params.column}&fromDate=${params.start}&toDate=${params.end}`;
		return FileSaver.saveAs(`${url}`, "export-transaksi-topup.xlsx");
	}

	generateTopUp(params): Observable<any> {

		const url = `${API_GNR}/generate-trtoken?column=${params.column}&fromDate=${params.start}&toDate=${params.end}`;
		return FileSaver.saveAs(`${url}`, "export-transaksi-topup.generate.xlsx");
	}

	// exportExcel() {
	// 	return FileSaver.saveAs(`${API_CSV}`, "export-transaksi-top-up.xlsx");
	// 	// return FileSaver.saveAs(`${API_CSV}?startDate=${top.startDate}&endDate=${top.endDate}`, `export-ar-${top.startDate}-${top.endDate}.xlsx`);
	// }
}
