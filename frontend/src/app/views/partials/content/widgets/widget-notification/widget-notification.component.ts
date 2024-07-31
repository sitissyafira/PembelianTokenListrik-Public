// Angular
import { Component, ElementRef, Input, OnInit,ChangeDetectorRef } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js/dist/Chart.min.js';
import { ServiceFormat } from '../../../../../core/serviceFormat/format.service'
@Component({
	selector: 'widget-notification',
	templateUrl: './widget-notification.component.html',
	styleUrls: ['./widget-notification.component.scss'],
})
export class WidgetNotificationComponent implements OnInit {
	// Public properties
	@Input() data: any[];
	@Input() role: "";
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
		this.cdr.markForCheck()
	}

	/** Init chart */
	
}
