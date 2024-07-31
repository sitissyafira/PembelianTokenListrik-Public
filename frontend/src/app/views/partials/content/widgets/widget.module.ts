import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule,MatChipsModule, MatSortModule, MatTableModule, MatProgressBarModule, } from '@angular/material';
import { CoreModule } from '../../../../core/core.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { InlineSVGModule } from 'ng-inline-svg';
// Datatable
import { DataTableComponent } from './general/data-table/data-table.component';
// General widgets
import { Widget1Component } from './widget1/widget1.component';
import { Widget4Component } from './widget4/widget4.component';
import { Widget5Component } from './widget5/widget5.component';
import { Widget12Component } from './widget12/widget12.component';
import { Widget14Component } from './widget14/widget14.component';
import { Widget26Component } from './widget26/widget26.component';
import { Timeline2Component } from './timeline2/timeline2.component';
import { WidgetTicketComponent, } from './widget-ticket/widget-ticket.component'
import { WidgetTargetComponent } from './widget-target/widget-target.component';
import { WidgetProfitLossComponent } from './widget-profit-loss/widget-profit-loss.component';
import { WidgetRevenueComponent } from './widget-revenue/widget-revenue.component';
import { WidgetBillingPaymentComponent } from './widget-billing-payment/widget-billing-payment.component';
import { WidgetRecordingMeterComponent } from './widget-recording-meter/widget-recording-meter.component';
import { WidgetUnitInformationComponent } from './widget-unit-information/widget-unit-information.component';
import { WidgetNotificationComponent } from './widget-notification/widget-notification.component';

@NgModule({
	declarations: [
		DataTableComponent,
		// Widgets
		Widget1Component,
		Widget4Component,
		Widget5Component,
		Widget12Component,
		Widget14Component,
		Widget26Component,
		Timeline2Component,
		WidgetTicketComponent,
		WidgetTargetComponent,
		WidgetProfitLossComponent,
		WidgetRevenueComponent,
		WidgetBillingPaymentComponent,
		WidgetRecordingMeterComponent,
		WidgetUnitInformationComponent,
		WidgetNotificationComponent,

	],
	exports: [
		DataTableComponent,
		// Widgets
		Widget1Component,
		Widget4Component,
		Widget5Component,
		Widget12Component,
		Widget14Component,
		Widget26Component,
		Timeline2Component,
		WidgetTicketComponent,
		WidgetTargetComponent,
		WidgetProfitLossComponent,
		WidgetRevenueComponent,
		WidgetBillingPaymentComponent,
		WidgetRecordingMeterComponent,
		WidgetUnitInformationComponent,
		WidgetNotificationComponent,
	],
	imports: [
		InlineSVGModule,
		CommonModule,
		PerfectScrollbarModule,
		MatTableModule,
		CoreModule,
		MatIconModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSortModule,
		// MatProgressBar,
		MatChipsModule, 
		MatProgressBarModule,
	]
})
export class WidgetModule {
}
