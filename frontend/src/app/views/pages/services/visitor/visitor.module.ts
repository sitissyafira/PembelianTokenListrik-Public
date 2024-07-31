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
import { VisitorComponent } from './visitor.component';
import { ListVisitorComponent } from './list-visitor/list-visitor.component';
import { AddVisitorComponent } from './add-visitor/add-visitor.component';
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

import {visitorReducer} from '../../../../core/services/visitor/visitor.reducer';
import {VisitorEffect} from '../../../../core/services/visitor/visitor.effect';
import { EditVisitorComponent } from './edit-visitor/edit-visitor.component';
import { ViewVisitorComponent } from './view-visitor/view-visitor.component';

const routes: Routes = [
	{
		path: '',
		component: VisitorComponent,
		children: [
			{
				path: '',
				component: ListVisitorComponent
			},
			{
				path: 'add',
				component: AddVisitorComponent
			},
			{
				path: 'edit/:id',
				component: EditVisitorComponent
			},
			{
				path: 'view/:id',
				component: ViewVisitorComponent
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
		StoreModule.forFeature('visitor', visitorReducer),
		EffectsModule.forFeature([VisitorEffect]),
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
		MatDialogModule
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
		VisitorComponent
	],
	declarations: [
		VisitorComponent,
		ListVisitorComponent,
		AddVisitorComponent,
		EditVisitorComponent,
		ViewVisitorComponent
	]
})
export class VisitorModule {}
