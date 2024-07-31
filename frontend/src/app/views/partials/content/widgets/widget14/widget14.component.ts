// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js/dist/Chart.min.js';

@Component({
	selector: 'kt-widget14',
	templateUrl: './widget14.component.html',
	styleUrls: ['./widget14.component.scss'],
})
export class Widget14Component implements OnInit {
	// Public properties
	@Input() title: string = "Bill Collections";
	@Input() desc: string = "Period 2023";
	@Input() data: { labels: string[]; datasets: any[] };
	@ViewChild('chart', {static: true}) chart: ElementRef;
	primaryColor: 'rgba(15, 18, 63, 1)'
	secondaryColor: 'rgba(69, 196, 176, 1)'
	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		if (!this.data) {
			this.data =  {
				labels: labels,
				datasets: [
					{
					  label: 'Target',
					  data: [100,202,2000,1222],
					  backgroundColor: 'rgba(15, 18, 63, 1)',
					  borderRadius:5,
					},
					{
					  label: 'Achievement',
					  data: [1,20,30,100],
					  backgroundColor: 'rgba(69, 196, 176, 1)',
					  borderRadius:5,
					},
				  ]
			};
		}

		this.initChartJS();
	}

	/** Init chart */
	initChartJS() {
		// For more information about the chartjs, visit this link
		// https://www.chartjs.org/docs/latest/getting-started/usage.html

		const chart = new Chart(this.chart.nativeElement, {
			type: 'bar',
			data: this.data,
			options: {
				responsive: true,
				legend: {
					position: 'top',
					display:false
				},
				scales: {
					x:{
						grid: {
							display: true,
							drawOnChartArea: true,
							drawTicks: true,
						  }
					},
					y:{
						grid: {
							display: false,
							drawOnChartArea: false,
							drawTicks: false,
						},
					},
					xAxes: [
						{
							gridLines: {
								display:false
							}
						}
					],
					yAxes: [{
						ticks: {
							suggestedMin: 50,
							suggestedMax: 3000
						},
						gridLines: {
							display:true,
							borderDash: [8, 4],
                			color: "rgba(128, 132, 140, 1)"
						},
					}]
				  },
				title: {
					display: false,
					text: 'Chart.js Bar Chart'
				},
				offset:true,
				plugins: {
				
				}
			}
		  });
	}
}
