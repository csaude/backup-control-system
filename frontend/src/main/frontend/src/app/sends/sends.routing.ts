/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Routes, RouterModule } from '@angular/router';
import { SendsComponent } from './sends.component';
import {SendFormComponent} from "./send-form/send-form.component";
import { AuthManagerSendsRead } from './authmanagerread';
import { AuthManagerSendsEdit } from './authmanageredit';

const sendsRoutes: Routes = [
  { path: 'sends', component: SendsComponent, pathMatch: 'full', canActivate:[AuthManagerSendsRead] },
  { path: 'send/new', component: SendFormComponent , canActivate:[AuthManagerSendsEdit]},
  { path: 'send/:uuid', component: SendFormComponent , canActivate:[AuthManagerSendsEdit]}
];

/** 
* @author Damasceno Lopes
*/
export const sendsRouting = RouterModule.forChild(sendsRoutes);
