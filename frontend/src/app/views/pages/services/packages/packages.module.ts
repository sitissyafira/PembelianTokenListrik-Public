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
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../../partials/content/crud';
// Components
import { PackagesComponent } from './packages.component';
import { ListPackagesComponent } from './list-packages/list-packages.component';
import { AddPackagesComponent } from './add-packages/add-packages.component';

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

import { packagesReducer } from '../../../../core/services/packages/packages.reducer';
import { PackagesEffect } from '../../../../core/services/packages/packages.effect';
import { EditPackagesComponent } from './edit-packages/edit-packages.component';
import { ViewPackagesComponent } from './view-packages/view-packages.component';

const routes: Routes = [
	{
		path: '',
		component: PackagesComponent,
		children: [
			{
				path: '',
				component: ListPackagesComponent
			},
			{
				path: 'add',
				component: AddPackagesComponent
			},
			{
				path: 'edit/:id',
				component: EditPackagesComponent
			},
			{
				path: 'view/:id',
				component: ViewPackagesComponent
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
		StoreModule.forFeature('packages', packagesReducer),
		EffectsModule.forFeature([PackagesEffect]),
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
		PackagesComponent
	],
	declarations: [
		PackagesComponent,
		ListPackagesComponent,
		AddPackagesComponent,
		EditPackagesComponent,
		ViewPackagesComponent
	]
})
export class PackagesModule { }
