import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { BlastNotificationComponent } from './blast-notification.component';
import { FormBlastNotificationComponent } from './form-blast-notification/form-blast-notification.component';
import { ListBlastNotificationComponent } from './list-blast-notification/list-blast-notification.component';


const routes: Routes = [
  {
    path: '',
    component: BlastNotificationComponent,
    children: [
      { path: '', component: ListBlastNotificationComponent },
      { path: 'add', component: FormBlastNotificationComponent },
      { path: 'duplicate/:id', component: FormBlastNotificationComponent },
      { path: 'detail/:id', component: FormBlastNotificationComponent, data: { readOnly: true } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlastNotificationRoutingModule { }
