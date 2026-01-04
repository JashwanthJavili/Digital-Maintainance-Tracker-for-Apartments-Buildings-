import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },
  { path: '**', redirectTo: '/login' }
];
