/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Routes, RouterModule } from '@angular/router';
import { AuthManagerServersRead } from './authmanagerread';
import { AuthManagerServersEdit } from './authmanageredit';
import { ServersComponent } from './servers.component';
import { ServerFormComponent } from "./server-form/server-form.component";

const serversRoutes: Routes = [
  { path: 'servers', component: ServersComponent, pathMatch: 'full', canActivate: [AuthManagerServersRead] },
  { path: 'servers/new', component: ServerFormComponent, canActivate: [AuthManagerServersEdit] },
  { path: 'servers/:uuid', component: ServerFormComponent, canActivate: [AuthManagerServersEdit] }
];

/** 
* @author Damasceno Lopes
*/
export const serversRouting = RouterModule.forChild(serversRoutes);
