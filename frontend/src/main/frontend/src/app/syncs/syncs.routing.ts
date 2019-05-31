import { Routes, RouterModule } from '@angular/router';
import { SyncsComponent } from './syncs.component';
import { SyncFormComponent } from "./sync-form/sync-form.component";
import { AuthManagerSyncsRead } from './authmanagerread';
import { AuthManagerSyncsEdit } from './authmanageredit';

const syncsRoutes: Routes = [
  { path: 'syncs', component: SyncsComponent, pathMatch: 'full', canActivate: [AuthManagerSyncsRead] },
  { path: 'syncs/new', component: SyncFormComponent, canActivate: [AuthManagerSyncsEdit] },
  { path: 'syncs/:uuid', component: SyncFormComponent, canActivate: [AuthManagerSyncsEdit] }
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const syncsRouting = RouterModule.forChild(syncsRoutes);
