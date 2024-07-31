import {Component, OnDestroy, OnInit, ElementRef, ViewChild} from '@angular/core';
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
import { DomSanitizer } from '@angular/platform-browser';
import { LeaseContractService } from '../../../../core/contract/lease/lease.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'kt-view-ticketUser',
  templateUrl: './view-ticketUser.component.html',
  styleUrls: ['./view-ticketUser.component.scss']
})
export class ViewTicketUserComponent implements OnInit {
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
	images: any;
	cResult: any[]=[];
	dResult: any[]=[];
	sResult: any[]=[];
    codenum : any;
    selectedFile: File;
    retrievedImage: any;
    base64Data: any;
    message: string;
    imageName: any;
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
        private sanitizer: DomSanitizer
      
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
		this.getUnitId(this.ticket.contract);
        this.loadDefect(this.ticket.subDefect.category)
        this.loadSubdefect(this.ticket.subDefect.defect)
    }

	createForm() {
        this.loadCategory();
		this.ticketForm = this.ticketFB.group({
		ticketId: [{value:this.ticket.ticketId, disabled:true}],
    	subject: [{value:this.ticket.subject,disabled:true}],
		contract: [{value:this.ticket.contract, disabled:true}],
		tenant_name:[{value:this.ticket.contract.contact_name, disabled:true}],
		tenant_phone:[{value:this.ticket.contract.contact_phone, disabled:true}],
		tenant_email : [{value:this.ticket.contract.contact_email, disabled:true}],
		category :[{value:this.ticket.subDefect.category, disabled:true}],
        dcategory:[{value:this.ticket.subDefect.defect, disabled:true}],
   		subDefect: [{value:this.ticket.subDefect._id, disabled:true}],
   	 	description: [{value:this.ticket.description, disabled:true}],
		priority: [{value:this.ticket.priority, disabled:true}],
		attachment:[],
		status: [{value:this.ticket.status, disabled:true}],
		ticketdate: [{value:this.ticket.createdDate, disabled:true}],
        });
    
        
    }
    
    // getImage() {
    //     //Make a call to Sprinf Boot to get the Image Bytes.
    //     const URL_IMAGE = `${environment.baseAPI}/api/ticket`
    //     console.log(URL_IMAGE)
    //     console.log(this.ticket._id)
    //     this.http.get(`${URL_IMAGE}/${this.ticket._id}/image`)
    //       .subscribe(
    //         res => {
    //           this.retrieveResonse = res;
    //           this.retrievedImage = this.retrieveResonse;
    //         }
    //       );
    //   }
    // getImage(){
    //     const URL_IMAGE = `${environment.baseAPI}/api/ticket`
    //     this.http.get((`${URL_IMAGE}/${this.ticket._id}/image`), { responseType: 'blob' }).subscribe(res => {
    //         console.log(res);
    //         return res;
    //     });
    //   }


    getImage(){
        const URL_IMAGE = `${environment.baseAPI}/api/ticket`
        this.http.get(`${URL_IMAGE}/${this.ticket._id}/image`).subscribe(res=> {
            this.images = res;
            console.log(res);
            console.log(this.images)
         });
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
		let result = 'View -  Ticket';
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}


}
