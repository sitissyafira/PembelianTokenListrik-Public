// Angular
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// RXJS
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { BillingService } from '../../../../core/billing/billing.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'billingreject-dialog',
  templateUrl: './billingreject.dialog.component.html',
  styleUrls: ['./billingreject.dialog.component.scss']
})
export class BillRejectPaymentDialog implements OnInit {
  title: string;
  subTitle: string;

  dataz = localStorage.getItem("currentUser");
  dataUser = JSON.parse(this.dataz);

  private subs: Subscription[] = [];

  billrejectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BillRejectPaymentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private billrejectFB: FormBuilder,
    private cdr: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private service: BillingService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.createForm()
    this.initItem();
  }

  toggleDataLoading(status = false) {
    this.cdr.markForCheck();
  }

  initItem() {
    this.getTitle()
    this.cdr.markForCheck();
  }

  getTitle() {
    this.title = this.data.title
    this.subTitle = this.data.subTitle
  }


  createForm() {
    this.billrejectForm = this.billrejectFB.group({
      reasonReject: [{ value: "", disabled: false }, Validators.required],
    });
  }

  onReject() {
    const controls = this.billrejectForm.controls
    if (!controls.reasonReject.value) {
      const message = 'Description is Required';
      this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
      return
    }
    const dataSend = {
      _id: this.data.idBilling,
      reasonReject: controls.reasonReject.value,
      handledBy: this.dataUser.id
    }


    this.service.rejectPayment(dataSend).subscribe(
      res => {
        this.dialogRef.close()
        const message = 'Successfully rejected payment billing';
        this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);

        const url = `/billing`;
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
      },
      error => {
        this.dialogRef.close()
        console.error(error)
        const message = 'Error while saving billing';
        this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
      }
    )

    this.dialogRef.close()

  }


}
