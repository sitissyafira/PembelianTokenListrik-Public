import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlastNotificationService } from '../blast-notification.service';

@Component({
  selector: 'kt-add-blast-notification',
  templateUrl: './form-blast-notification.component.html',
  styleUrls: ['./form-blast-notification.component.scss']
})
export class FormBlastNotificationComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInputEl: ElementRef;
  datauser = localStorage.getItem("user");
  mode: string = 'Form';
  readOnly = false;
  images = [];
  myFiles = [];
  hasError: boolean = false;
  formGroup: FormGroup;
  currentData;

  subs: Subscription[] = [];

  loading: boolean;

  selectedTab: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: Router,
    private blastService: BlastNotificationService
  ) { }

  ngOnInit() {
    this.checkCurrentMode();
    this.createForm();
  }

  checkCurrentMode() {
    const activeRouteDataSub = this.activatedRoute.data.subscribe(data => {
      console.log(data, "data bar")
      if(data && data.readOnly) this.readOnly = true;
      else this.readOnly = false;
    });
    this.subs.push(activeRouteDataSub);

    const activeRouteSub = this.activatedRoute.params.subscribe(params => {
      const { id } = params;

      if(id) {

        if(this.readOnly) this.mode = 'Detail';
        else this.mode = 'Duplicate';

        this.loadData(id);
        this.cdr.markForCheck();
      } else {
        this.mode = 'Form';
        this.cdr.markForCheck();
      }
    })
    console.log(this.mode, "mode")
    this.subs.push(activeRouteSub);
  }

  loadData(id) {
    this.setLoading(true);

    const loadDataSub = this.blastService.getItemById(id).subscribe(
      (resp) => {
        this.currentData = resp.data;
        this.setData();
      },
      err => {
        console.error('Something went wrong! ', err);
      },
      () => this.setLoading(false)
    );
  }

  setData() {
    this.images[0] = this.currentData.image;
    this.myFiles[0] = this.currentData.image;

    this.formGroup.patchValue({
      title: this.currentData.title,
      description: this.currentData.description,
      image: this.currentData.image
    });

    if(this.readOnly) {
      this.formGroup.disable();
    }
  }

  selectFile(e) {
    const files = (e.target as HTMLInputElement).files;
    for (let i = 0; i < files.length; i++) {
      // Skip uploading if file is already selected
      // const alreadyIn = this.myFiles.filter(tFile => tFile.name === files[i].name).length;
      // if(alreadyIn) continue;

      this.myFiles[0] = files[i];

      const reader = new FileReader();
      reader.onload = () => {
        this.images[0] = { url: reader.result };
        this.cdr.markForCheck();
      }
      reader.readAsDataURL(files[i]);
    }
  }

  createForm() {
    if (this.mode === "Detail") {
      this.formGroup = this.formBuilder.group({
        title: ["", Validators.required],
        description: ["", Validators.required],
        image: [null],
        text : ["", Validators.required],
        created_by : [this.datauser]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        title: ["", Validators.required],
        description: ["", Validators.required],
        image: [null],
        text : ["", Validators.required],
        created_by : [this.datauser]
      });
    }
  }

  submit() {
    this.setLoading(true);
    const formData: FormData = new FormData();

    formData.append("title", this.formGroup.get('title').value);
    formData.append("description", this.formGroup.get('description').value);
    formData.append("attachment", this.myFiles[0]);

    formData.append("text", this.formGroup.get('text').value)
    formData.append("created_by", this.formGroup.get('created_by').value)

    // Dummy
    setTimeout(() => {
      this.setLoading(false);
    }, 1500);

    // Send this if API is completed
    this.blastService.pushNotification(formData).subscribe(
      (resp) => {

        this.setLoading(false);
        if (resp){
          const url = `/blast-news`;
					this.route.navigateByUrl(url, { relativeTo: this.activatedRoute });
        }
      },
      (err) => {
        alert('Err..');
        this.setLoading(false);
      }
    )
  }

  clearSelection() {
    this.myFiles = [];
    this.images = [];
    this.fileInputEl.nativeElement.value = "";

    this.cdr.markForCheck();
  }

  setLoading(val: boolean) {
    this.loading = val;
    this.cdr.markForCheck();
  }

  onAlertClose() {
    this.hasError = false;
  }

  ngOnDestroy() {
    this.subs.map(s => s.unsubscribe());
  }
}
