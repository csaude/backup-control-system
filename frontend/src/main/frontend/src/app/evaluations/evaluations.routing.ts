/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Routes, RouterModule } from '@angular/router';
import { EvaluationsComponent } from './evaluations.component';
import { EvaluationFormComponent } from "./evaluation-form/evaluation-form.component";
import { AuthManagerEvaluationsRead } from './authmanagerread';
import { AuthManagerEvaluationsEdit } from './authmanageredit';
const evaluationsRoutes: Routes = [
  { path: 'evaluations', component: EvaluationsComponent, pathMatch: 'full', canActivate: [AuthManagerEvaluationsRead] },
  { path: 'evaluations/new', component: EvaluationFormComponent, canActivate: [AuthManagerEvaluationsEdit] },
  { path: 'evaluations/:uuid', component: EvaluationFormComponent, canActivate: [AuthManagerEvaluationsEdit] }
];
export const evaluationsRouting = RouterModule.forChild(evaluationsRoutes);
