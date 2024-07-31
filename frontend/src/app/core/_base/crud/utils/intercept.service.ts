// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
// NgRX
import { Actions, Effect, ofType } from '@ngrx/effects';
// RxJS
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import { AuthActionTypes, Login, Logout, Register, UserLoaded, UserRequested } from './../../../auth/_actions/auth.actions';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
	private returnUrl: string;
	constructor(public action$: Actions, public router: Router) {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.returnUrl = event.url;
			}
		});
	}
	// intercept request and add token
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		// tslint:disable-next-line:no-debugger
		// modify request
		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${localStorage.getItem(environment.authTokenKey)}`
			}
		});
		// console.log('----request----');
		// console.log(request);
		// console.log('--- end of request---');

		return next.handle(request).pipe(
			tap(
				event => {
					if (event instanceof HttpResponse) {
						// console.log('all looks good');
						// http response status code
						// console.log(event.status);
					}
				},
				error => {
					// http response status code
					// console.log('----response----');
					// console.error('status code:');
					// tslint:disable-next-line:no-debugger
					let errorMessage = '';
					if (error.error instanceof ErrorEvent) {
						// client-side error
						errorMessage = `Error: ${error.error.message}`;
					} else {
						// server-side error
						errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
						if(error.status === 401){
							localStorage.removeItem(environment.authTokenKey);
							this.router.navigate(['/auth/login']);
						}else if (error.status === 403){
							this.router.navigate(['/error/403']);
						}
					}
					return throwError(errorMessage);
					console.error(error.status);
					console.error(error.message);
					// console.log('--- end of response---');
				}
			)
		);
	}
}
