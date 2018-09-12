/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from "./login-form/login-form.component";

const loginsRoutes: Routes = [
  { path: 'login', component: LoginFormComponent }
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const loginsRouting = RouterModule.forChild(loginsRoutes);
