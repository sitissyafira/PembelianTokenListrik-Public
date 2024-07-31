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
import { PartialsModule } from '../../../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../../../partials/content/crud';
// Components
import { FacilityComponent } from './facility.component';
import { ListFacilityComponent } from './list-facility/list-facility.component';
import { AddFacilityComponent } from './add-facility/add-facility.component';

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
	MatTooltipModule,
} from '@angular/material';

import { facilityReducer } from '../../../../../core/services/facility-reservation/facility/facility.reducer';
import { FacilityEffect } from '../../../../../core/services/facility-reservation/facility/facility.effect';
import { EditFacilityComponent } from './edit-facility/edit-facility.component';
import { ViewFacilityComponent } from './view-facility/view-facility.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

const routes: Routes = [
	{
		path: '',
		component: FacilityComponent,
		children: [
			{
				path: '',
				component: ListFacilityComponent
			},
			{
				path: 'add',
				component: AddFacilityComponent
			},
			{
				path: 'edit/:id',
				component: EditFacilityComponent
			},
			{
				path: 'view/:id',
				component: ViewFacilityComponent
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
		StoreModule.forFeature('facility', facilityReducer),
		EffectsModule.forFeature([FacilityEffect]),
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
		NgxMaterialTimepickerModule
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
		FacilityComponent
	],
	declarations: [
		FacilityComponent,
		ListFacilityComponent,
		AddFacilityComponent,
		EditFacilityComponent,
		ViewFacilityComponent
	]
})
export class FacilityReservationModule { }
