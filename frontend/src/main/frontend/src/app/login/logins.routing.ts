import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from "./login-form/login-form.component";
const loginsRoutes: Routes = [
  { path: 'login', component: LoginFormComponent }
];
export const loginsRouting = RouterModule.forChild(loginsRoutes);
