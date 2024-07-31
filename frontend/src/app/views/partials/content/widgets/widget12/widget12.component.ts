// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout config
import { LayoutConfigService } from '../../../../../core/_base/layout';

/**
 * Sample components with sample data
 */
@Component({
	selector: 'kt-widget12',
	templateUrl: './widget12.component.html',
	styleUrls: ['./widget12.component.scss']
})
export class Widget12Component implements OnInit {

	// Public properties
	@Input() data: { labels: string[], datasets: any[] };
	@Input() type = 'doughnut';
	@ViewChild('chart', {static: true}) chart: ElementRef;

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
		if (!this.data) {
			const color = Chart.helpers.color;
			this.data = {
				labels: ['Data1','Data2'],
        datasets: [
          { 
            data: [55,45],
            backgroundColor: ['rgba(15, 18, 63, 1)','rgba(255, 118, 117, 1)'],
            fill: false
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
				responsive: true,
				maintainAspectRatio: false,
				legend: {
          display: false
        },
        tooltips:{
          enabled:false
        }
			}
		});
	}
}
