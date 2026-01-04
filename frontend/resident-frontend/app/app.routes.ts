import { Routes } from '@angular/router';
import { MaintenanceRequestComponent } from './resident/maintenance-request/maintenance-request.component';
import { RequestHistoryComponent } from './resident/request-history/request-history.component';
import { FeedbackComponent } from './resident/feedback/feedback.component';
import { LoginComponent } from './login/login.component';
import { ResidentGuard } from './guards/resident.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'maintenance/new', 
    component: MaintenanceRequestComponent,
    canActivate: [ResidentGuard]
  },
  { 
    path: 'maintenance/history', 
    component: RequestHistoryComponent,
    canActivate: [ResidentGuard]
  },
  { 
    path: 'resident/feedback/:id', 
    component: FeedbackComponent,
    canActivate: [ResidentGuard]
  },
  { path: '**', redirectTo: '/login' }
];
