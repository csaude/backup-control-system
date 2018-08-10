/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
const homesRoutes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' }
];
export const homesRouting = RouterModule.forChild(homesRoutes);
