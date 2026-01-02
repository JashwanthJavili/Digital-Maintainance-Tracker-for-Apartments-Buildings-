import { Routes } from '@angular/router';
import { MaintenanceRequestComponent } from './resident/maintenance-request/maintenance-request.component';
import { RequestHistoryComponent } from './resident/request-history/request-history.component';
import { FeedbackComponent } from './resident/feedback/feedback.component';
import { ResidentGuard } from './guards/resident.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/resident/new', pathMatch: 'full' },
  { 
    path: 'resident/new', 
    component: MaintenanceRequestComponent,
    canActivate: [ResidentGuard]
  },
  { 
    path: 'resident/history', 
    component: RequestHistoryComponent,
    canActivate: [ResidentGuard]
  },
  { 
    path: 'resident/feedback/:id', 
    component: FeedbackComponent,
    canActivate: [ResidentGuard]
  },
  { path: '**', redirectTo: '/resident/new' }
];
