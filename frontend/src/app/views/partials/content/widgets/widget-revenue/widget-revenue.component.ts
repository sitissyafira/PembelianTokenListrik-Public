// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout config
import { LayoutConfigService } from '../../../../../core/_base/layout';

/**
 * Sample components with sample data
 */
@Component({
	selector: 'widget-revenue',
	templateUrl: './widget-revenue.component.html',
	styleUrls: ['./widget-revenue.component.scss']
})
export class WidgetRevenueComponent implements OnInit {

	// Public properties
	@Input() data: { labels: string[], datasets: any[] };
	@Input() type = 'line';
	@ViewChild('chart', {static: true}) chart: ElementRef;
	@Input() period = '';
	@Input() graph = [];
	@Input() label = [];
	@Input() totalAmount = ""
	/**
	 * Component constructor
	 * @param layoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		if (!this.graph && !this.label) {
			const color = Chart.helpers.color;
			this.data = {
				labels: ['Data1','Data2'],
				datasets: [
				//   { 
				//     data: [55,45],
				//     backgroundColor: ['rgba(15, 18, 63, 1)','rgba(255, 118, 117, 1)'],
				//     fill: false
				//   },
					{
						label: 'Dataset 2',
						data: [55,56],
						// borderColor: 'rgba(15, 18, 63, 1)',
						// backgroundColor: 'rgba(15, 18, 63, 0.5)',
						lineTension: 0.4,   
					}
				]
			};
		}else{
			this.data = {
				labels: this.label,
				datasets: [
				//   { 
				//     data: [55,45],
				//     backgroundColor: ['rgba(15, 18, 63, 1)','rgba(255, 118, 117, 1)'],
				//     fill: false
				//   },
					{
						label: 'Dataset',
						data: this.graph,
						fill:false,
						borderColor: 'rgba(15, 18, 63, 1)',
						// backgroundColor: 'rgba(15, 18, 63, 0.5)',
						lineTension: 0.4,   
					}
				]
			};
		}

		this.initChart();
	}

	private initChart() {
		// For more information about the chartjs, visit this link
		// https://www.chartjs.org/docs/latest/getting-started/usage.html

		const chart = new Chart(this.chart.nativeElement, {
			type: this.type,
			data: this.data,
			options: {
				cutoutPercentage: 40,
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: false
				},
				scales:{
					// x:{
					// 	grid: {
					// 		display: false,
					// 		drawOnChartArea: false,
					// 		drawTicks: false,
					// 	  }
					// },
					// y:{
					// 	grid: {
					// 		display: true,
					// 		drawOnChartArea: true,
					// 		drawTicks: true,
					// 	},
					// },
					y:{
						type: 'linear',
						grace: '5%',
						grid: {
							display: false,
							drawOnChartArea: false,
							drawTicks: false,
						},
					},
					xAxes: [
						{
							gridLines: {
								display:false,								
								drawOnChartArea: false,
								drawTicks: false,
							},
							
							ticks: {
								display: false
							}
						}
						
					],
					yAxes: [{
						gridLines: {
							display:false,
							borderDash: [8, 4],
                			// color: "rgba(128, 132, 140, 1)"
						},
						ticks: {
							display: false
						}
					}]
				},
				tooltips:{ enabled:true }
			}
		});
	}
}
