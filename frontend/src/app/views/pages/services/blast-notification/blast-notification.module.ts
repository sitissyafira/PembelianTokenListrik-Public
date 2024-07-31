// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '../../../partials/partials.module';
import { BlastNotificationRoutingModule } from './blast-notification-routing.module';

// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../../core/_base/crud';

// Components
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MAT_DIALOG_DEFAULT_OPTIONS
} from '@angular/material';
import { ActionNotificationComponent } from '../../../partials/content/crud';
import { BlastNotificationComponent } from './blast-notification.component';
import { ListBlastNotificationComponent } from './list-blast-notification/list-blast-notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBlastNotificationComponent } from './form-blast-notification/form-blast-notification.component';


@NgModule({
  declarations: [
    BlastNotificationComponent,
    ListBlastNotificationComponent,
    FormBlastNotificationComponent
  ],
  imports: [
    CommonModule,
    BlastNotificationRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    PartialsModule
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
    BlastNotificationComponent
  ]
})
export class BlastNotificationModule { }
