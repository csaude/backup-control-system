import { Routes, RouterModule } from '@angular/router';
import { SendsComponent } from './sends.component';
import {SendFormComponent} from "./send-form/send-form.component";
import { AuthManagerSendsRead } from './authmanagerread';
import { AuthManagerSendsEdit } from './authmanageredit';
const sendsRoutes: Routes = [
  { path: 'sends', component: SendsComponent, pathMatch: 'full', canActivate:[AuthManagerSendsRead] },
  { path: 'sends/new', component: SendFormComponent , canActivate:[AuthManagerSendsEdit]},
  { path: 'sends/:uuid', component: SendFormComponent , canActivate:[AuthManagerSendsEdit]}
];
export const sendsRouting = RouterModule.forChild(sendsRoutes);
