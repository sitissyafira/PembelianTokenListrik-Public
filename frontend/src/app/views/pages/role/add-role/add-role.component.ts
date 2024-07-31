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
  selector: 'kt-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit, OnDestroy {
	// Public properties
	codenum : any
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
			} else {
				this.role = new RoleModel();
				this.role.clear();
				this.initRole();
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
			roleCode: [this.role.roleCode, Validators.required],
			role: [this.role.role, Validators.required],
			active: [this.role.active],
			max_login: [this.role.max_login, Validators.required],
		});
	}else{
			// this.getNumber();
			this.roleForm = this.roleFB.group({
				roleCode: ["", Validators.required],
				role: ["", Validators.required],
				active: [""],
				max_login : [],
				
			});
		}
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


	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.roleForm.controls;
		/** check form */
		if (this.roleForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		this.loading = true;
		const editedRole = this.prepareRole();

		if (editedRole._id) {
			this.updateRole(editedRole, withBack);
			return;
		}

		this.addRole(editedRole, withBack);
	}
	prepareRole(): RoleModel {
		const controls = this.roleForm.controls;
		const _role = new RoleModel();
		_role.clear();
		_role._id = this.role._id;
		_role.roleCode = controls.roleCode.value;
		_role.role = controls.role.value.toLowerCase();
		_role.active = controls.active.value;
		_role.max_login = controls.max_login.value;
		return _role;
	}

	addRole( _role: RoleModel, withBack: boolean = false) {
		const addSubscription = this.service.createRole(_role).subscribe(
			res => {
				const message = `New Role successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/role`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding role | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	updateRole(_role: RoleModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateRole(_role).subscribe(
			res => {
				const message = `Role successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/role`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding role | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'Create Role';
		if (!this.role || !this.role._id) {
			return result;
		}

		result = `Edit Role`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
