import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TechnicianRoutingModule } from './technician-routing.module';
import { TechnicianDashboardComponent } from './technician-dashboard/technician-dashboard.component';
import { UpdateStatusComponent } from './update-status/update-status.component';

@NgModule({
  declarations: [TechnicianDashboardComponent, UpdateStatusComponent],
  imports: [CommonModule, FormsModule, RouterModule, TechnicianRoutingModule],
})
export class TechnicianModule {}
