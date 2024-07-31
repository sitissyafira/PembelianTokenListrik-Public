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
export class ConfirmationDialog implements OnInit {
  title: string;
  subTitle: string;


  private subs: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
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
    this.getTitle()
    this.cdr.markForCheck();
  }

  getTitle() {
    this.title = this.data.title
    this.subTitle = this.data.subTitle
  }







}
