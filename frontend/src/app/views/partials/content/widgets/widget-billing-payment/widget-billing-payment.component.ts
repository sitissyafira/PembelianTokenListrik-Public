// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js/dist/Chart.min.js';
import { ServiceFormat } from '../../../../../core/serviceFormat/format.service'
@Component({
	selector: 'widget-billing-payment',
	templateUrl: './widget-billing-payment.component.html',
	styleUrls: ['./widget-billing-payment.component.scss'],
})
export class WidgetBillingPaymentComponent implements OnInit {
	// Public properties
	@Input() title: string;
	@Input() data: { 
		// labels: string[]; 
		period: string;
		totalCount: number;
		totalAmount: string;
		paidAmount: string;
		outstandingAmount:string;
	};
	@Input() graph: number[];
	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService,private serviceFormat: ServiceFormat) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		
	}

	/** Init chart */
	
}
