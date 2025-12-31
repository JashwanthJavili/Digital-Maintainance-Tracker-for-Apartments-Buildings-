import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' }
];
