import { Routes } from '@angular/router';
import { TechnicianGuard } from './guards/technician.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'technician/dashboard',
    loadComponent: () => import('./technician-dashboard/technician-dashboard.component').then(m => m.TechnicianDashboardComponent),
    canActivate: [TechnicianGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
