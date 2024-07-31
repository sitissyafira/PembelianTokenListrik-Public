// Angular
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { environment } from '../../../../../../environments/environment';
import { take } from 'rxjs/operators';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;

	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>, private http: HttpClient) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
		
	}

	/**
	 * Log out
	 */
	async logout() {
		const uid = await this.getUid()
		const url = `${environment.baseAPI}/api/user/logout/${uid}`

		
		this.http.get(url).subscribe(
			(resp) => {
				// console.log(resp, 'oke')
			},
			(error) => {
				console.error('ERROR:', error)
			},
			() => {
				this.store.dispatch(new Logout());
			}
		)
	}

	/**
	 * @desc Private method to get user id with async method.
	 * 			 Parent method need to be 'asynced' to call this method.
	 */ 
	private async getUid() {
		let uid;
		const subs = await this.store.select(currentUser).subscribe(i => uid = i._id )
		subs.unsubscribe()
		
		return uid
	}
}
