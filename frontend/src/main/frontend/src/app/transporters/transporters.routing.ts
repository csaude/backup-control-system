/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Routes, RouterModule } from '@angular/router';
import { TransportersComponent } from './transporters.component';
import { TransporterFormComponent } from "./transporter-form/transporter-form.component";
import { AuthManagerTransportersRead } from './authmanagerread';
import { AuthManagerTransportersEdit } from './authmanageredit';
const transportersRoutes: Routes = [
  { path: 'transporters', component: TransportersComponent, pathMatch: 'full', canActivate: [AuthManagerTransportersRead] },
  { path: 'transporters/new', component: TransporterFormComponent, canActivate: [AuthManagerTransportersEdit] },
  { path: 'transporters/:uuid', component: TransporterFormComponent, canActivate: [AuthManagerTransportersEdit] }
];
export const transportersRouting = RouterModule.forChild(transportersRoutes);
