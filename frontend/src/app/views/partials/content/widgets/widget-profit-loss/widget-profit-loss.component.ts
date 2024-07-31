// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout config
import { LayoutConfigService } from '../../../../../core/_base/layout';
import ChartDataLabels from 'chartjs-plugin-datalabels';
/**
 * Sample components with sample data
 */
@Component({
	selector: 'widget-profit-loss',
	templateUrl: './widget-profit-loss.component.html',
	styleUrls: ['./widget-profit-loss.component.scss']
})
export class WidgetProfitLossComponent implements OnInit {

	// Public properties
	@Input() data: { labels: string[], datasets: any[] };
	@Input() type = 'doughnut';
	@Input() profitPercentage: number;
	@Input() profitAmount: number;
	@Input() lossPercentage: number;
	@Input() lossAmount: number;
	@Input() period: any;
	@Input() graph: number[]
	@ViewChild('chart', { static: true }) chart: ElementRef;

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
		console.log(this.profitPercentage, this.lossPercentage)
		if (!this.graph) {
			const color = Chart.helpers.color;
			this.data = {
				labels: ['Data1', 'Data2'],
				datasets: [
					{
						data: [0, 0],
						backgroundColor: ['rgba(255, 118, 117, 1)', 'rgba(15, 18, 63, 1)'],
						fill: false
					},
				]
			};
		} else {
			let label = []
			let data = []
			console.log(this.profitPercentage, this.lossPercentage)
			if (this.profitPercentage != 0) {
				label.push(this.profitPercentage)
				data.push(this.profitPercentage)
			}
			if (this.lossPercentage != 0) {
				label.push(this.lossPercentage)
				data.push(this.lossPercentage)
			}
			const color = Chart.helpers.color;
			this.data = {
				labels: label,
				datasets: [
					{
						data: data,
						backgroundColor: ['rgba(255, 118, 117, 1)', 'rgba(15, 18, 63, 1)'],
						fill: false,
						datalabels: {
							color: "#FFFFFF",
							anchor: 'center'
						}
					},
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
				tooltips: {
					enabled: false
				},
				plugins: {
					datalabels: {
						formatter: function (value, context) {
							return value + '%';
						}
					}
				}
			},

			plugins: [ChartDataLabels],
		});
	}
}
