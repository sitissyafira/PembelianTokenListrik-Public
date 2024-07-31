import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KtDialogService } from '../../../../core/_base/layout';
import { environment } from '../../../../../../src/environments/environment';
import {SubheaderService} from "../../../../core/_base/layout";

interface DataStatisticModel {
  unit: {
    total: number;
    bast: number;
    available: number;
  };
  ticket: {
    total: number;
    open: {
      total: number;
      percentage: number;
    };
    progress: {
      total: number;
      percentage: number;
    };
    done: {
      total: number;
      percentage: number;
    };
  }
}

@Component({
  selector: 'kt-general',
  templateUrl: './customerService.component.html',
  styleUrls: ['./customerService.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerServiceComponent implements OnInit, OnDestroy {

  data: DataStatisticModel;
  subs: any = [];
  loading: boolean;

  constructor(
    private http: HttpClient,
    private ktDialogueService: KtDialogService,
    private ref: ChangeDetectorRef,
    private subheaderService: SubheaderService,
  ) { }

  ngOnInit() {
    this.loadData();
    // this.subheaderService.setTitle('Package');
  }

  

  // Module to stop loading
  stopLoading() {
    this.loading = false;
    this.ref.markForCheck();
    this.ktDialogueService.hide();
  }
  
  loadData() {
    const url = `${environment.baseAPI}/api/dashboard/cs`;
    this.loading = true;

    // Save the subs for to be unsubs
    this.subs.push(
      this.http.get<any>(url).subscribe(
        (resp) => {
          // Handler when error
          this.data = resp.data;
          console.log(this.data)
          this.stopLoading();
        },
        (error) => {
          this.stopLoading();
        }
      )
    );
  }

  ngOnDestroy() {
    // Unsubscribe all subs event to prevent memory leak
    this.subs.map(item => {
      item.unsubscribe();
    });
  }
}