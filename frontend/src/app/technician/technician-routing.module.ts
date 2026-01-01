import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnicianDashboardComponent } from './technician-dashboard/technician-dashboard.component';
import { UpdateStatusComponent } from './update-status/update-status.component';

const routes: Routes = [
  { path: 'dashboard', component: TechnicianDashboardComponent },
  { path: 'update/:id', component: UpdateStatusComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnicianRoutingModule {}
