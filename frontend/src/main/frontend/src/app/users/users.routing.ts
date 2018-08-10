/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserFormComponent } from "./user-form/user-form.component";
import { UserDetailsFormComponent } from "./user-form/user-details-form.component";
import { AuthManagerUsersRead } from './authmanagerread';
import { AuthManagerUsersEdit } from './authmanageredit';
const usersRoutes: Routes = [
  { path: 'users', component: UsersComponent, pathMatch: 'full', canActivate: [AuthManagerUsersRead] },
  { path: 'users/new', component: UserFormComponent, canActivate: [AuthManagerUsersEdit] },
  { path: 'users/:uuid', component: UserFormComponent, canActivate: [AuthManagerUsersEdit] },
  { path: 'users/details/:uuid', component: UserDetailsFormComponent }
];
export const usersRouting = RouterModule.forChild(usersRoutes);
