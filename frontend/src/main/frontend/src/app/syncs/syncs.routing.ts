/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Routes, RouterModule } from '@angular/router';
import { SyncsComponent } from './syncs.component';
import { SyncFormComponent } from "./sync-form/sync-form.component";
import { AuthManagerSyncsRead } from './authmanagerread';
import { AuthManagerSyncsEdit } from './authmanageredit';

const syncsRoutes: Routes = [
  { path: 'syncs', component: SyncsComponent, pathMatch: 'full', canActivate: [AuthManagerSyncsRead] },
  { path: 'sync/new', component: SyncFormComponent, canActivate: [AuthManagerSyncsEdit] },
  { path: 'sync/:uuid', component: SyncFormComponent, canActivate: [AuthManagerSyncsEdit] }
];

/** 
* @author Damasceno Lopes
*/
export const syncsRouting = RouterModule.forChild(syncsRoutes);
