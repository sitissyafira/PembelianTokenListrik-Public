import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,AfterViewInit,ElementRef,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KtDialogService } from '../../../../core/_base/layout';
import { environment } from '../../../../../../src/environments/environment';
import { ServiceFormat } from '../../../../core/serviceFormat/format.service'
import Chart from 'chart.js'

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
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralComponent implements OnInit,AfterViewInit, OnDestroy {
  
	localstorage = localStorage.getItem("currentUser");
	dataUser = JSON.parse(this.localstorage);
	role = this.dataUser.role;
  displayedColumns: string[] = ['position', 'title', 'progress', 'total'];
  data: DataStatisticModel;
  subs: any = [];
  loading: boolean;
  @ViewChild('canvasInput', { static: true }) canvasInput: ElementRef;
  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;
  dashboardData: any 

  // @ViewChild('myChart',{static:false})
  // canvas: ElementRef<HTMLCanvasElement>;

  donutChart: any
  donutData = {
    datasets: [{
      data: [10, 20, 30]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Red',
        'Yellow',
        'Blue'
    ]
  }
  notificationsList:any[] =[
    {name:"private_ticket",title:"Private Area Ticket",date:"",icon:"./assets/media/icons/dashboard_icon/private_ticket.svg",total:0,hideFrom:["admin-finance","spv-finance"]},
    {name:"public_ticket", title:"Public Area Ticket",date:"",icon:"./assets/media/icons/dashboard_icon/public_ticket.svg",total:0,hideFrom:["admin-finance","spv-finance"]},
    {name:"billing", title:"New payment IPL billing",date:"",icon:"./assets/media/icons/dashboard_icon/billing.svg",total:0,hideFrom:[]},
    {name:"token", title:"Top Up Electricity Tokens",date:"",icon:"./assets/media/icons/dashboard_icon/token.svg",total:0,hideFrom:[]},
    {name:"electricity", title:"Electricity Meter Recording",date:"",icon:"./assets/media/icons/dashboard_icon/electricity.svg",total:0,hideFrom:[]},
    {name:"water", title:"Water Meter Recording",date:"",icon:"./assets/media/icons/dashboard_icon/water.svg",total:0,hideFrom:[]},
    {name:"facility_reservation", title:"Facility Reservations",date:"",icon:"./assets/media/icons/dashboard_icon/facility_reservation.svg",total:0,hideFrom:["admin-finance","spv-finance","engineer","admin-engineer","spv-engineer"]},
  ]
  progressRecording:any = {
    title:"Progress Recording Meter",
    date:"April 2023",
    list: [
      { name:"electricity_meter",title:"Electric Meter",value:0, total:0,color:"warning"},
      { name:"water_meter",title:"Water Meter",value:0, total:0,color:"dark"},
      { name:"gas_meter",title:"Gas Meter",value:0, total:0,color:"primary"}
    ]
  }
  billingPaymentProgress:any = {
    month:"March 2023",
    totalCount: 300,
    totalAmount: 1047197,
    paid:1000000,
    unpaid:47197,
  }
  refresh: boolean = false
  constructor(
    private http: HttpClient,
    private ktDialogueService: KtDialogService,
    private ref: ChangeDetectorRef,
    private elementRef: ElementRef,
    private serviceFormat: ServiceFormat
  ) { }

  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() {
    // this.context = (
    //   this.canvasInput.nativeElement as HTMLCanvasElement
    // ).getContext('2d');

    // this.createDonutChart()
  }

  // Module to stop loading
  stopLoading() {
    this.loading = false;
    this.ref.markForCheck();
    this.ktDialogueService.hide();
  }
  
  loadData() {
    // console.log(this.notificationsList.length)
    const url = `${environment.baseAPI}/api/dashboard/new?refresh=${this.refresh}`;

    this.loading = true;
    if(this.refresh == true) this.refresh = false //back to false

    // Save the subs for to be unsubs
    this.subs.push(
      this.http.get<any>(url).subscribe(
        (resp) => {
          // Handler when error
          // this.data = resp.data;
          this.dashboardData = resp.data
          this.progressRecording.list.map((item) => {
            item.value = this.dashboardData.recordingMeter.items[item.name].value
            item.total = this.dashboardData.recordingMeter.items[item.name].total

          })
          this.progressRecording.date = this.dashboardData.recordingMeter.period
          this.notificationsList.map((item,index)=> {
            item.date = this.dashboardData.notifications.period
            item.total = this.dashboardData.notifications[item.name]
          })
          console.log(this.data);
          this.stopLoading();
        },
        (error) => {
          this.stopLoading();
        }
      )
    );
  }
  setRefresh(){
    this.refresh = true
  }

  ngOnDestroy() {
    // Unsubscribe all subs event to prevent memory leak
    this.subs.map(item => {
      item.unsubscribe();
    });
  }
  onRefresh(){
    this.refresh = true
    this.loadData()
  }
  
}
