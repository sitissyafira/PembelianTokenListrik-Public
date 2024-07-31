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
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { SubdefectComponent } from './subdefect.component';
import { ListSubdefectComponent } from './list-subdefect/list-subdefect.component';
import { AddSubdefectComponent } from './add-subdefect/add-subdefect.component';

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

import {subdefectReducer} from '../../../core/subdefect/subdefect.reducer';
import {SubdefectEffect} from '../../../core/subdefect/subdefect.effect';
import { ViewSubdefectComponent } from './view-subdefect/view-subdefect.component';
import { EditSubdefectComponent } from './edit-subdefect/edit-subdefect.component';

const routes: Routes = [
	{
		path: '',
		component: SubdefectComponent,
		children: [
			{
				path: '',
				component: ListSubdefectComponent
			},
			{
				path: 'add',
				component: AddSubdefectComponent
			},
			{
				path: 'edit/:id',
				component: EditSubdefectComponent
			},
			{
				path: 'view/:id',
				component: ViewSubdefectComponent
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
		StoreModule.forFeature('subdefect', subdefectReducer),
		EffectsModule.forFeature([SubdefectEffect]),
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
		SubdefectComponent
	],
	declarations: [
		SubdefectComponent,
		ListSubdefectComponent,
		AddSubdefectComponent,
		EditSubdefectComponent,
		ViewSubdefectComponent,
	]
})
export class SubdefectModule {}
