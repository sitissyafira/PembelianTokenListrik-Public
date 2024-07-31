import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import {RoleModel} from "../../../../core/role/role.model";
import {
	selectLastCreatedRoleId,
	selectRoleActionLoading,
	selectRoleById
} from "../../../../core/role/role.selector";
import {RoleService} from '../../../../core/role/role.service';

@Component({
  selector: 'kt-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss']
})
export class ViewRoleComponent implements OnInit, OnDestroy {
	// Public properties
	role: RoleModel;
	RoleId$: Observable<string>;
	oldRole: RoleModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	roleForm: FormGroup;
	date1 = new FormControl(new Date());
	hasFormErrors = false;
	checker : boolean;
	loading : boolean;
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private roleFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: RoleService,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectRoleActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectRoleById(id))).subscribe(res => {
					if (res) {
						this.checker = res.active;
						this.role = res;
						this.oldRole = Object.assign({}, this.role);
						this.initRole();
					}
				});
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initRole() {
		this.createForm();
	}

	createForm() {
		if (this.role._id){
		this.roleForm = this.roleFB.group({
			roleCode: [{value:this.role.roleCode, disabled:true}],
			role: [{value:this.role.role, disabled:true}],
			active: [{value:this.role.active, disabled:true}],
			max_login: [{value:this.role.max_login, disabled:true}],
		});}
	}

	goBackWithId() {
		const url = `/role`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshRole(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/role/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	
	getComponentTitle() {
		let result = 'View Role';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
