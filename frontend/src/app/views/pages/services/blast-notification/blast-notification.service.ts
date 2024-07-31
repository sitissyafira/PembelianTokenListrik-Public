import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";

const API = `${environment.baseAPI}/api/news`;

const API_PUSH = `${environment.baseAPI}/api/pushnotif`;

@Injectable({
	providedIn: "root",
})
export class BlastNotificationService {
	constructor(private http: HttpClient) {}

	getList(qParams): Observable<any> {
		const headers = new HttpHeaders();
		const params = new URLSearchParams();

		headers.set("Content-Type", "application/json");

		for (const key in qParams)
			if (qParams[key]) params.set(key, qParams[key]);

		const url = `${API}/allnews?${params}`;

		return this.http.get<any>(url, { headers });
	}

	pushNotification(payload): Observable<any> {
		const url = `${API_PUSH}/postnews1`;

		return this.http.post<any>(url, payload);
	}

	getItemById(id): Observable<any> {
		const headers = new HttpHeaders();
		headers.set("Content-Type", "application/json");

		const url = `${API}/${id}`;

		return this.http.get<any>(url, { headers });
	}
}
