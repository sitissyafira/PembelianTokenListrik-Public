// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js/dist/Chart.min.js';

@Component({
	selector: 'widget-ticket',
	templateUrl: './widget-ticket.component.html',
	styleUrls: ['./widget-ticket.component.scss'],
})
export class WidgetTicketComponent implements OnInit {
	// Public properties
	@Input() title: string;
	@Input() desc: string = "Period";
	@Input() data: { labels: string[]; datasets: any[] };
	@Input() graph: number[];
	@ViewChild('chart', { static: true }) chart: ElementRef;
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
		const labels = ["a", "b", "c", "d"]
		if (!this.graph) {
			this.data = {
				labels: labels,
				datasets: [{
					label: 'Ticket',
					data: [65, 59, 80, 81],
					backgroundColor: [
						'rgba(250, 190, 122, 1)',
						'rgba(246, 134, 106, 1)',
						'rgba(89, 230, 246, 1)',
						'rgba(118, 97, 226, 1)',
					],
					borderColor: [
						'rgba(250, 190, 122, 1)',
						'rgba(246, 134, 106, 1)',
						'rgba(89, 230, 246, 1)',
						'rgba(118, 97, 226, 1)',
					],
					borderWidth: 1
				}]
			};
		} else {
			this.data = {
				labels: labels,
				datasets: [{
					label: 'Ticket',
					data: this.graph,
					backgroundColor: [
						'rgba(250, 190, 122, 1)',
						'rgba(246, 134, 106, 1)',
						'rgba(89, 230, 246, 1)',
						'rgba(118, 97, 226, 1)',
					],
					borderColor: [
						'rgba(250, 190, 122, 1)',
						'rgba(246, 134, 106, 1)',
						'rgba(89, 230, 246, 1)',
						'rgba(118, 97, 226, 1)',
					],
					borderWidth: 1,
					borderRadius: 10,
				}]
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
				cutoutPercentage: 40,
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					position: 'top',
					display: false
				},
				tooltips: {
					enabled: false
				},
				scales: {
					x: {
						grid: {
							display: false,
							drawOnChartArea: true,
							drawTicks: true,
						}
					},
					y: {
						type: 'linear',
						grid: {
							display: false,
							drawOnChartArea: true,
							drawTicks: false,
						},
					},
					xAxes: [
						{
							gridLines: {
								display: false
							}
						}
					],
					yAxes: [{
						gridLines: {
							display: false,
							borderDash: [8, 4],
							color: "rgba(128, 132, 140, 1)"
						},
						ticks: {
							display: true, // Ubah ini menjadi true agar label sumbu-y tampil
							max: 1000, // Sesuaikan nilai maksimum sesuai kebutuhan Anda
							beginAtZero: true // Mulai dari nol
						}
					}]
				},
				title: {
					display: false,
					text: 'Chart.js Bar Chart'
				},
				offset: true,
				plugins: {
					datalabels: {
						align: 'end',
						anchor: 'end',
						formatter: function (value, context) {
							return value == 0 ? "" : value;
						},
						color: function (context) {
							return context.dataset.backgroundColor;
						},
					}
				}

			},

			plugins: [ChartDataLabels],
		});
	}
}
