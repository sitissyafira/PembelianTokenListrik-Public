// Angular
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// RXJS
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation.dialog.component.html',
  styleUrls: ['./confirmation.dialog.component.scss']
})
export class SavingDialog implements OnInit {


  isGenerateBilling: string = "" /* To determine the condition of the generating billing process in progress */
  msgErrorGenerate: string = "" /* To display message error proccessing generate */



  private subs: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<SavingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initItem();
  }

  toggleDataLoading(status = false) {
    this.cdr.markForCheck();
  }

  initItem() {
    this.getData()
    console.log(this.data, "this.getData()")
    this.cdr.markForCheck();
  }

  getData() {
    this.isGenerateBilling = this.data.isGenerateBilling
    this.msgErrorGenerate = this.data.msgErrorGenerate
  }


  closePopUp() {
    this.dialogRef.close()
  }

}
