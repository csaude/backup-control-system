/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
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
export const serversRouting = RouterModule.forChild(serversRoutes);
