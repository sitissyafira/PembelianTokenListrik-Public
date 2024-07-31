// Angular
import { Component, ElementRef, Input, OnInit,ChangeDetectorRef } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js/dist/Chart.min.js';
import { ServiceFormat } from '../../../../../core/serviceFormat/format.service'
@Component({
	selector: 'widget-recording-meter',
	templateUrl: './widget-recording-meter.component.html',
	styleUrls: ['./widget-recording-meter.component.scss'],
})
export class WidgetRecordingMeterComponent implements OnInit {
	// Public properties
	displayedColumns: string[] = ['position', 'title', 'progress', 'total'];
	@Input() data: { 
		title: string;
		date: string;
		list: any;
		
	};
	@Input() graph: number[];
	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService,private cdr:ChangeDetectorRef) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		console.log(this.data.list)
		this.cdr.markForCheck()
	}

	/** Init chart */
	
}
