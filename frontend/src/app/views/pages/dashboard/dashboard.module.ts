// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { GeneralComponent } from './general/general.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatProgressSpinnerModule, MatProgressBarModule,MatTableModule, MatCardModule, MatChipsModule,MatIconModule } from '@angular/material';
import { AccountingComponent } from './accounting/accounting.component';
import { EngComponent } from './eng/eng.component';
import { CustomerServiceComponent } from './customerService/customerService.component';
import { FinanceComponent } from './finance/finance.component';
import { ManagerComponent } from './manager/manager.component';
// import { EngineerComponent } from './engineer/engineer.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: '',
				component: GeneralComponent
			},
			{
				path: 'accounting',
				component: AccountingComponent
			},
			{
				path: 'engineer',
				component: EngComponent
			},
			{
				path: 'finance',
				component: FinanceComponent
			},
			{
				path: 'customer',
				component: CustomerServiceComponent
			},
			{
				path: 'manager',
				component: ManagerComponent
			},
			
		]
	}
];

@NgModule({
	imports: [
		InlineSVGModule,
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild(routes),

		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatTableModule,
		MatCardModule,
		MatChipsModule,
		MatIconModule,
	],
	providers: [],
	entryComponents: [DashboardComponent],
	declarations: [
		DashboardComponent,
		GeneralComponent,
		AccountingComponent,
		EngComponent,
		CustomerServiceComponent,
		FinanceComponent,
		ManagerComponent
	],
})
export class DashboardModule {
}
