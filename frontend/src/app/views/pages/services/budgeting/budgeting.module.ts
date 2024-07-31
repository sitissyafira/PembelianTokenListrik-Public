// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../../partials/content/crud';
// Components
import { BudgetingComponent } from './budgeting.component';
import { ListBudgetingComponent } from './list-budgeting/list-budgeting.component';
import { AddBudgetingComponent } from './add-budgeting/add-budgeting.component';
import { ViewBudgetingComponent } from './view-budgeting/view-budgeting.component';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';

import {budgetingReducer} from '../../../../core/services/budgeting/budgeting.reducer';
import {BudgetingEffect} from '../../../../core/services/budgeting/budgeting.effect';

const routes: Routes = [
	{
		path: '',
		component: BudgetingComponent,
		children: [
			{
				path: '',
				component: ListBudgetingComponent
			},
			{
				path: 'add',
				component: AddBudgetingComponent
			},
			// {
			// 	path: 'edit/:id',
			// 	component: EditBudgetingComponent
			// },
			{
				path: 'view/:id',
				component: ViewBudgetingComponent
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('budgeting', budgetingReducer),
		EffectsModule.forFeature([BudgetingEffect]),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		BudgetingComponent
	],
	declarations: [
		BudgetingComponent,
		ListBudgetingComponent,
		AddBudgetingComponent,
		ViewBudgetingComponent
	]
})
export class BudgetingModule {}
