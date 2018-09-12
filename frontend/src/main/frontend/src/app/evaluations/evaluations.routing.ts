/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Routes, RouterModule } from '@angular/router';
import { EvaluationsComponent } from './evaluations.component';
import { EvaluationFormComponent } from "./evaluation-form/evaluation-form.component";
import { AuthManagerEvaluationsRead } from './authmanagerread';
import { AuthManagerEvaluationsEdit } from './authmanageredit';

const evaluationsRoutes: Routes = [
  { path: 'evaluations', component: EvaluationsComponent, pathMatch: 'full', canActivate: [AuthManagerEvaluationsRead] },
  { path: 'evaluation/new', component: EvaluationFormComponent, canActivate: [AuthManagerEvaluationsEdit] },
  { path: 'evaluation/:uuid', component: EvaluationFormComponent, canActivate: [AuthManagerEvaluationsEdit] }
];

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
export const evaluationsRouting = RouterModule.forChild(evaluationsRoutes);
