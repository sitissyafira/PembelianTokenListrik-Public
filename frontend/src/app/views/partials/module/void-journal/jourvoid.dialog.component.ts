// Angular
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// RXJS
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { JourVoidService } from '../../../../core/void/jourVoid/jourVoid.service';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
@Component({
  selector: 'jourvoid-dialog',
  templateUrl: './jourvoid.dialog.component.html',
  styleUrls: ['./jourvoid.dialog.component.scss']
})
export class JourVoidDelete implements OnInit {
  billdelForm: FormGroup;

  hasFormErrors = false;
  dataGetLocal = localStorage.getItem("currentUser");
  dataUser = JSON.parse(this.dataGetLocal);

  isGenerateBilling: string = "" /* To determine the condition of the generating billing process in progress */
  msgErrorGenerate: string = "" /* To display message error proccessing generate */


  private subs: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<JourVoidDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private delBillFB: FormBuilder,
    private cdr: ChangeDetectorRef,
    private service: JourVoidService,
    private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.initItem();
  }

  toggleDataLoading(status = false) {
    this.cdr.markForCheck();
  }

  initItem() {
    this.createForm()
    this.cdr.markForCheck();
  }



  closePopUp() {
    this.dialogRef.close()
  }


  createForm() {
    this.billdelForm = this.delBillFB.group({
      reasonDel: [{ value: "", disabled: false }, Validators.required],
      descriptionDelete: [{ value: "", disabled: false }, Validators.required],
    });
  }

  closed() {
    this.dialogRef.close()
  }
  closedNoSure() {
    this.dialog.closeAll()
  }

  /** Pop Up validateDelete
   * This is a popup for the progress of generating billing
   */
  validateDelete(content) {
    const controls = this.billdelForm.controls
    if (this.billdelForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      return;
    }


    this.dialog.open(content, {
      data: {
        input: ""
      },
      maxWidth: "300px",
      minHeight: "150px",
      disableClose: false
    });
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  /** 
   * clickDeleted
   */
  clickDeleted() {
    const controls = this.billdelForm.controls
    const reasonDel = controls.reasonDel.value
    const descriptionDelete = controls.descriptionDelete.value
    const dataSend = { ...this.data.dataJournal, reasonDel, descriptionDelete, updateBy: this.dataUser.id, type: this.data.type }

    this.service.deleteJourVoiding(dataSend).subscribe(
      res => {
        const message = `Charge cleared successfully, check your journal`;
        this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);

        this.dialog.closeAll()
      },
      err => {
        console.error(err)
        const message = `Error delete void billing`;
        this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);

        this.dialog.closeAll()
      }
    )
  }

}
