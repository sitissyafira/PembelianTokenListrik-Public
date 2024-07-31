// Angular
import { Component, ElementRef, Input, OnInit,ChangeDetectorRef } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js/dist/Chart.min.js';
import { ServiceFormat } from '../../../../../core/serviceFormat/format.service'
@Component({
	selector: 'widget-unit-information',
	templateUrl: './widget-unit-information.component.html',
	styleUrls: ['./widget-unit-information.component.scss'],
})
export class WidgetUnitInformationComponent implements OnInit {
	// Public properties
	displayedColumns: string[] = ['position', 'title', 'progress', 'total'];
	@Input() total: number;
	@Input() bast: number;
	@Input() available: number;
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
