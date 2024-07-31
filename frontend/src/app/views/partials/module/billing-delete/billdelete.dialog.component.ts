// Angular
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// RXJS
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { VoidBillService } from '../../../../core/void/voidBill/voidBill.service';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
@Component({
  selector: 'billdelete-dialog',
  templateUrl: './billdelete.dialog.component.html',
  styleUrls: ['./billdelete.dialog.component.scss']
})
export class BillingDelete implements OnInit {
  billdelForm: FormGroup;

  // Upload Image (new) START
  images: any[] = []
  myFiles: any[] = []
  @ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;
  // Upload Image (new) END

  hasFormErrors = false;
  dataGetLocal = localStorage.getItem("currentUser");
  dataUser = JSON.parse(this.dataGetLocal);

  isGenerateBilling: string = "" /* To determine the condition of the generating billing process in progress */
  msgErrorGenerate: string = "" /* To display message error proccessing generate */


  private subs: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<BillingDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private delBillFB: FormBuilder,
    private cdr: ChangeDetectorRef,
    private service: VoidBillService,
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
      attachment: [{ value: "", disabled: false }],
    });
  }

  // Upload Image (new) START
  selectFileUpload(e) {
    const files = (e.target as HTMLInputElement).files;

    if (files.length > 1 || this.myFiles.length >= 1 || this.images.length >= 1) {
      this.fileInputEl.nativeElement.value = "";
      const message = `Only 1 images are allowed to select`;
      this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);

      return
    }

    for (let i = 0; i < files.length; i++) {
      // Skip uploading if file is already selected
      const alreadyIn = this.myFiles.filter(tFile => tFile.name === files[i].name).length > 0;
      if (alreadyIn) continue;

      this.myFiles.push(files[i]);

      const reader = new FileReader();
      reader.onload = () => {
        this.images.push({ name: files[i].name, url: reader.result });
        this.cdr.markForCheck();
      }
      reader.readAsDataURL(files[i]);
    }
  }

  clearSelection() {
    this.myFiles = [];
    this.images = [];
    this.fileInputEl.nativeElement.value = "";
    this.cdr.markForCheck();
  }

  removeSelectedFile(item) {
    this.myFiles = this.myFiles.filter(i => i.name !== item.name);
    this.images = this.images.filter(i => i.url !== item.url);
    this.fileInputEl.nativeElement.value = "";

    this.cdr.markForCheck();
  }
  // Upload Image (new) END

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
    const attachment = this.myFiles
    const dataSend = { ...this.data.dataBilling, reasonDel, descriptionDelete, attachment, updateBy: this.dataUser.id }

    if (reasonDel === "copd" && this.myFiles.length === 0) {
      const message = `Select image attachment!`;
      this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);

      return
    }

    this.service.deleteBillVoid(dataSend).subscribe(
      res => {
        const message = `Charge cleared successfully, check your bill`;
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
