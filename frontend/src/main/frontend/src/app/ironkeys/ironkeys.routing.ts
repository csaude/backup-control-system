import { Routes, RouterModule } from '@angular/router';
import { AuthManagerIronkeysRead } from './authmanagerread';
import { AuthManagerIronkeysEdit } from './authmanageredit';
import { IronkeysComponent } from './ironkeys.component';
import { IronkeyFormComponent } from "./ironkey-form/ironkey-form.component";
const ironkeysRoutes: Routes = [
  { path: 'ironkeys', component: IronkeysComponent, pathMatch: 'full', canActivate: [AuthManagerIronkeysRead] },
  { path: 'ironkeys/new', component: IronkeyFormComponent, canActivate: [AuthManagerIronkeysEdit] },
  { path: 'ironkeys/:uid', component: IronkeyFormComponent, canActivate: [AuthManagerIronkeysEdit] }
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const ironkeysRouting = RouterModule.forChild(ironkeysRoutes);
