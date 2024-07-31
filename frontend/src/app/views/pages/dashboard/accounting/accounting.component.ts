import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KtDialogService } from '../../../../core/_base/layout';
import { environment } from '../../../../../../src/environments/environment';

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
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountingComponent implements OnInit, OnDestroy {

  data: DataStatisticModel;
  subs: any = [];
  loading: boolean;

  constructor(
    private http: HttpClient,
    private ktDialogueService: KtDialogService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  // Module to stop loading
  stopLoading() {
    this.loading = false;
    this.ref.markForCheck();
    this.ktDialogueService.hide();
  }
  
  loadData() {
    const url = `${environment.baseAPI}/api/dashboard`;

    this.loading = true;

    // Save the subs for to be unsubs
    this.subs.push(
      this.http.get<any>(url).subscribe(
        (resp) => {
          // Handler when error
          this.data = resp.data;
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
