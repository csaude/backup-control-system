/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const homesRoutes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' }
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const homesRouting = RouterModule.forChild(homesRoutes);