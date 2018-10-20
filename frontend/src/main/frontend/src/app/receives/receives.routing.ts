/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Routes, RouterModule } from '@angular/router';
import { ReceivesComponent } from './receives.component';
import { ReceiveFormComponent } from "./receive-form/receive-form.component";
import { AuthManagerReceivesRead } from './authmanagerread';
import { AuthManagerReceivesEdit } from './authmanageredit';

const receivesRoutes: Routes = [
  { path: 'receives', component: ReceivesComponent, pathMatch: 'full', canActivate: [AuthManagerReceivesRead] },
  { path: 'receives/new', component: ReceiveFormComponent, canActivate: [AuthManagerReceivesEdit] },
  { path: 'receives/:uuidr', component: ReceiveFormComponent, canActivate: [AuthManagerReceivesEdit] },
  { path: 'receives/send/:uuid', component: ReceiveFormComponent, canActivate: [AuthManagerReceivesEdit] }
];

/** 
* @author Damasceno Lopes
*/
export const receivesRouting = RouterModule.forChild(receivesRoutes);
