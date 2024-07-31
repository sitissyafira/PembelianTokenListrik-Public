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
import {TicketModel} from "../../../../core/ticket/ticket.model";
import {
	selectLastCreatedTicketId,
	selectTicketActionLoading,
	selectTicketById
} from "../../../../core/ticket/ticket.selector";
import {TicketService} from '../../../../core/ticket/ticket.service';
import * as _moment from 'moment';
const moment = _rollupMoment || _moment;
import {default as _rollupMoment, Moment} from 'moment';
import { SelectionModel } from '@angular/cdk/collections';

import { OwnershipContractService } from '../../../../core/contract/ownership/ownership.service';
import { QueryOwnerTransactionModel } from '../../../../core/contract/ownership/queryowner.model';
import { CategoryService } from '../../../../core/category/category.service';
import { QueryCategoryModel } from '../../../../core/category/querycategory.model';
import { QueryDefectModel } from '../../../../core/defect/querydefect.model';
import { DefectService } from '../../../../core/defect/defect.service';
import { SubdefectService } from '../../../../core/subdefect/subdefect.service';
import { QuerySubdefectModel } from '../../../../core/subdefect/querysubdefect.model';
import { HttpClient } from '@angular/common/http';
import { LeaseContractService } from '../../../../core/contract/lease/lease.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'kt-add-ticketUser',
  templateUrl: './add-ticketUser.component.html',
  styleUrls: ['./add-ticketUser.component.scss']
})
export class AddTicketUserComponent implements OnInit {
	// Public properties
	ticket: TicketModel;
	fileToUpload: File = null;
	//file;
	TicketId$: Observable<string>;
	oldTicket: TicketModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	ticketForm: FormGroup;
	date = new FormControl(moment());
	date1 = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	duedate = new FormControl();
	selection = new SelectionModel<TicketModel>(true, []);
	hasFormErrors = false;
	unitResult: any[]=[];
	myFiles: any [] = []
	images: any [] = []
	cResult: any[]=[];
	dResult: any[]=[];
	sResult: any[]=[];
	codenum : any;
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private ticketFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: TicketService,
		private ownService: OwnershipContractService,
		private leaseService: LeaseContractService,
		private cService : CategoryService,
		private dService : DefectService,
		private sService : SubdefectService,
		private layoutConfigService: LayoutConfigService,
		private http : HttpClient,
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectTicketActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectTicketById(id))).subscribe(res => {
					if (res) {
						this.ticket = res;
						this.oldTicket = Object.assign({}, this.ticket);
						this.initTicket();
					}
				});
			} else {
				this.ticket = new TicketModel();
				this.ticket.clear();
				this.initTicket();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initTicket() {
		this.createForm();
		this.loadUnit();
		this.loadCategory();
		this.getNumber();
	}

	createForm() {
		this.ticketForm = this.ticketFB.group({
		ticketId: [{value:"", disabled:true}, Validators.required],
    	subject: ["", Validators.required],
		contract: ["", Validators.required],
		tenant_name:[""],
		tenant_phone:[""],
		tenant_email : [""],
		category :[""],
		dcategory:[""],
   		subDefect: [""],
   	 	description: [""],
		priority: [""],
		attachment:[null],
		status: ["open"],
		ticketdate: [{value:this.date1.value, disabled:true}],
		});
		
	}

	uploadFile(event) {
		const files = (event.target as HTMLInputElement).files;
		for (var i = 0; i < files.length; i++) { 
			const image = {
				name: '',
				url : ''
			}
			this.myFiles.push(files[i]);

			image.name = files[i].name;
			console.log('raw files: ', files[i].name);

			const reader = new FileReader();
			reader.onload =  (filedata) => {
				image.url = reader.result + '';
				console.log(image);
				this.images.push(image);
			};
			reader.readAsDataURL(files[i]);
		}
	}

	removeAll(){
		// Remove all images on array
		while(this.myFiles.length) {
			console.log('Deleting: ', this.myFiles[0]);
			this.myFiles.shift();
			this.images.shift();
		}

		(<HTMLInputElement>document.querySelector('#input')).value = null;

		// Make sure all files are deleted
		!(this.myFiles.length > 0)
		? console.log('Image cleared!')
		: console.log(this.myFiles);

		console.log((<HTMLInputElement>document.querySelector('#input')).value);
	}

	// removeSelectedImg(name, e) {
	// 	// Work later with remove by filter array with image name
	// 	e.target.remove();
	// }


	submitForm() {
		const formData: any = new FormData();
		for (var i = 0; i < this.myFiles.length; i++) { 
			formData.append("attachment", this.myFiles[i]);
		}
		formData.append("ticketId", this.ticketForm.get('ticketId').value);
		formData.append("subject", this.ticketForm.get('subject').value);
		formData.append("contract", this.ticketForm.get('contract').value);
		formData.append("subDefect", this.ticketForm.get('subDefect').value);
		formData.append("description", this.ticketForm.get('description').value);
		formData.append("priority", this.ticketForm.get('priority').value);
		formData.append("status", this.ticketForm.get('status').value);
		formData.append("ticketdate", this.ticketForm.get('ticketdate').value);
		
		this.http.post(`${environment.baseAPI}/api/ticket/`, formData).subscribe(
		  (response) => {
				const message = `New Ticket successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/UserTicket`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
		},
		  (error) =>  {
						console.error(error);
						const message = 'Error while adding ticket | ' + error.statusText;
						this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
					}
		)
	  }
	
	getNumber() {
		const controls = this.ticketForm.controls;
		this.service.generateTicketCode().subscribe(
			res => {
				this.codenum = res.data
				controls.ticketId.setValue(this.codenum);
			}
		)
	}

	loadUnit() {
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.ownService.getAllDataUnit(queryParams).subscribe(
			res => {
				this.unitResult = res.data;
			}
		);
	}


	getUnitId(id) {
		const controls = this.ticketForm.controls;
		this.ownService.findOwneshipById(id).subscribe(
			data => {
				controls.tenant_name.setValue(data.data.contact_name);
				controls.tenant_phone.setValue(data.data.contact_phone);
				controls.tenant_email.setValue(data.data.contact_email);
			}
		);
		this.leaseService.findLeaseById(id).subscribe(
			data => {
				controls.tenant_name.setValue(data.data.contact_name);
				controls.tenant_phone.setValue(data.data.contact_phone);
				controls.tenant_email.setValue(data.data.contact_email);
			}
		);
	}

	loadCategory() {
		this.selection.clear();
		const queryParams = new QueryCategoryModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.cService.getListCategory(queryParams).subscribe(
			res => {
				this.cResult = res.data;
			}
		);
	}

	categoryOnChange(id){
		if(id){
			this.loadDefect(id);
		}
	}

	loadDefect(id) {
		this.selection.clear();
		const queryParams = new QueryDefectModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.dService.getListDefectbyCategoryId(id).subscribe(
			res => {
				this.dResult = res.data;
			}
		);
	}

	defectOnChange(id){
		if(id){
			this.loadSubdefect(id);
		}
	}

	loadSubdefect(id) {
		this.selection.clear();
		const queryParams = new QuerySubdefectModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.sService.findSubdefectByIdParent(id).subscribe(
			res => {
				this.sResult = res.data;
			}
		);
	}

	subDefectOnChange(id){
		const controls = this.ticketForm.controls;
		this.sService.findSubdefectByIdPriority(id).subscribe(data => {
			controls.priority.setValue(data.data.priority);
		});
	}



	goBackWithId() {
		const url = `/UserTicket`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshTicket(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/UserTicket/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.ticket = Object.assign({}, this.oldTicket);
		this.createForm();
		this.hasFormErrors = false;
		this.ticketForm.markAsPristine();
		this.ticketForm.markAsUntouched();
		this.ticketForm.updateValueAndValidity();
	}

	getComponentTitle() {
		let result = 'Create Ticket';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	
}
