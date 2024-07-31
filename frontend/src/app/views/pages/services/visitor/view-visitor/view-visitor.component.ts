import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { VisitorModel } from "../../../../../core/services/visitor/visitor.model";
import {
	selectLastCreatedVisitorId,
	selectVisitorActionLoading,
	selectVisitorById
} from "../../../../../core/services/visitor/visitor.selector";
import { VisitorService } from '../../../../../core/services/visitor/visitor.service';
import { QueryOwnerTransactionModel } from '../../../../../core/contract/ownership/queryowner.model';
import { SelectionModel } from '@angular/cdk/collections';
import { UnitService } from '../../../../../core/unit/unit.service';
import { OwnershipContractService } from '../../../../../core/contract/ownership/ownership.service';
import { LeaseContractService } from '../../../../../core/contract/lease/lease.service';
import moment from 'moment';
import { ModuleVisitor } from '../../../../../core/services/visitor/module/moduleservice';


@Component({
	selector: 'kt-view-visitor',
	templateUrl: './view-visitor.component.html',
	styleUrls: ['./view-visitor.component.scss']
})
export class ViewVisitorComponent implements OnInit, OnDestroy {
	// Public properties
	type;
	datauser = localStorage.getItem("user");
	visitor: VisitorModel;
	VisitorId$: Observable<string>;
	oldVisitor: VisitorModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	visitorForm: FormGroup;
	hasFormErrors = false;
	unitResult: any[] = [];
	loading: boolean = false;
	selection = new SelectionModel<VisitorModel>(true, []);
	date1 = new FormControl(new Date());

	loadingForm: boolean = false

	checker: boolean = false
	openLainnya: boolean = false

	images: any[] = []
	imagesVisitorPict: any[] = []

	// Check data checkout START
	loadCheckOut: boolean = false
	formCheckOut = {
		checkOut: new FormControl(),
		checkOut_jam: new FormControl(),
	}
	// Check data checkout END

	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private moduleVisitor: ModuleVisitor, // services for flow visitor systems (ex: changeStatus > to change status, etc.)
		private router: Router,
		private visitorFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: VisitorService,
		private serviceUnit: UnitService,
		private ownService: OwnershipContractService,
		private leaseService: LeaseContractService,
		private layoutConfigService: LayoutConfigService,
		private cd: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectVisitorActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				// this.store.pipe(select(selectVisitorById(id))).subscribe(res => {
				this.service.findVisitorById(id).subscribe(res => {
					if (res) {
						this.visitor = res.data;
						this.initVisitor()
						if (res.data.checkOut && res.data.checkOut_jam) {
							this.loadCheckOut = true
							this.formCheckOut.checkOut.setValue(moment(res.data.checkOut).format('L'))
							this.formCheckOut.checkOut_jam.setValue(res.data.checkOut_jam)
						}
						if (res.data.idCardNo && res.data.idCardType) this.checker = true
						if (res.data.idCardType === "lainnya") this.openLainnya = true
					}
				});
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	initVisitor() {
		if (this.visitor.attachment) this.images.push(this.visitor.attachment)
		if (this.visitor.visitorAttachment) this.imagesVisitorPict.push(this.visitor.visitorAttachment)
		this.createForm();
	}


	createForm() {
		this.visitorForm = this.visitorFB.group({

			// Flow Baru #START
			// Appointment Request #START
			unit: [{ value: this.visitor.unit._id, disabled: false }],
			unitName: [{ value: this.visitor.unit.cdunt, disabled: false }],
			customerId: [{ value: this.visitor.customerId._id, disabled: false }],
			customerName: [{ value: this.visitor.customerId.cstrmrnm, disabled: false }],
			tanggal: [{ value: moment(this.visitor.tanggal).format('L'), disabled: false }],
			jam: [{ value: this.visitor.jam, disabled: false }],
			// Appointment Request #END

			// Check In #START
			checkIn: [{ value: this.visitor.checkIn ? moment(this.visitor.checkIn).format('L') : "", disabled: false }],
			checkIn_jam: [{ value: this.visitor.checkIn_jam ? this.visitor.checkIn_jam : "", disabled: false }],
			// Check In #END

			// Guest Information #START
			guestId: [{ value: this.visitor.guestId, disabled: false }],
			nama: [{ value: this.visitor.nama, disabled: false }],
			jenisKelamin: [{ value: this.visitor.jenisKelamin, disabled: true }], // input type ( M = "MALE" , F = "FEMALE" )
			// company: [{ value: this.visitor.company, disabled: false }],
			// address: [{ value: this.visitor.address, disabled: false }],
			// city: [{ value: this.visitor.city ? this.visitor.city.name : "", disabled: false }],
			guestQty: [{ value: this.visitor.guestQty, disabled: false }],
			noTelp: [{ value: this.visitor.noTelp, disabled: false }],
			idCardType: [{ value: this.visitor.idCardType, disabled: true }],
			idCardNo: [{ value: this.visitor.idCardNo, disabled: true }],
			keperluan: [{ value: this.visitor.keperluan, disabled: false }],
			// Guest Information #END

			// Tambahan
			isRead: [{ value: this.visitor.isRead, disabled: false }],
			statusVisitor: [{ value: this.visitor.statusVisitor, disabled: false }],
			rejectReason: [{ value: this.visitor.rejectReason ? this.visitor.rejectReason : " - ", disabled: false }],
			// Flow Baru #END

			// Flow Lama
			remark: [{ value: this.visitor.remark ? this.visitor.remark : "", disabled: false }],
			contract_name: [{ value: this.visitor.contract_name ? this.visitor.contract_name : "", disabled: false }],
			createdBy: [{ value: this.visitor.createdBy._id }],
			// createdDate: [{ value: this.visitor.createdDate, disabled: false }],
		});

		this.loadingForm = true
		this.cd.markForCheck()
	}

	goBackWithId() {
		const url = `/visitor`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshVisitor(isNew: boolean = false, id: string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/visitor/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	// Change Status Visitor #START
	_getStatusClass(value: string) {
		if (value === "wait-confirm-web" || value === "wait-confirm-mob") return "chip--wait-confirm"
		else if (value === "approve-by-web" || value === "approve-by-mob") return "chip--approve"
		else if (value === "check-in") return "chip--check-in"
		else if (value === "check-out") return "chip--check-out"
		else if (value === "cancel-by-mob") return "chip--cancel"
		else if (value === "cancel-by-web") return "chip--cancel"
		else if (value === "reject-by-mob") return "chip--reject"
	}
	// Change Status Visitor #END

	getComponentTitle() {
		let result = `View Visitor Pengunjung`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
