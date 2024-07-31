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
import { MasterComponent } from './master.component';
import { ListMasterComponent } from './list-master/list-master.component';
import { AddMasterComponent } from './add-master/add-master.component';

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

import { masterReducer } from '../../../../../core/services/facility-reservation/master/master.reducer';
import { MasterEffect } from '../../../../../core/services/facility-reservation/master/master.effect';
import { EditMasterComponent } from './edit-master/edit-master.component';
import { ViewMasterComponent } from './view-master/view-master.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

const routes: Routes = [
	{
		path: '',
		component: MasterComponent,
		children: [
			{
				path: '',
				component: ListMasterComponent
			},
			{
				path: 'add',
				component: AddMasterComponent
			},
			{
				path: 'edit/:id',
				component: EditMasterComponent
			},
			{
				path: 'view/:id',
				component: ViewMasterComponent
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
		StoreModule.forFeature('master', masterReducer),
		EffectsModule.forFeature([MasterEffect]),
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
		MasterComponent
	],
	declarations: [
		MasterComponent,
		ListMasterComponent,
		AddMasterComponent,
		EditMasterComponent,
		ViewMasterComponent
	]
})
export class MasterMasterReservationModule { }
