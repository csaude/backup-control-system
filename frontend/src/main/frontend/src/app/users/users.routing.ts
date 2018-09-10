/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserFormComponent } from "./user-form/user-form.component";
import { UserDetailsFormComponent } from "./user-form/user-details-form.component";
import { AuthManagerUsersRead } from './authmanagerread';
import { AuthManagerUsersEdit } from './authmanageredit';

const usersRoutes: Routes = [
  { path: 'users', component: UsersComponent, pathMatch: 'full', canActivate: [AuthManagerUsersRead] },
  { path: 'user/new', component: UserFormComponent, canActivate: [AuthManagerUsersEdit] },
  { path: 'user/:uuid', component: UserFormComponent, canActivate: [AuthManagerUsersEdit] },
  { path: 'user/profile/:uuid', component: UserDetailsFormComponent }
];

/** 
* @author Damasceno Lopes
*/
export const usersRouting = RouterModule.forChild(usersRoutes);
