import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AdminService } from '../services/admin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatSelectModule,
    MatButtonModule,
     MatSidenavModule,
     RouterModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

displayedColumns: string[] = [
  'id',
  'category',
  'description',
  'technician',
  'status',
  'action'
];

  requests: any[] = [];
  technicians: any[] = [];
  selectedTech: { [key: number]: number } = {};

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadTechnicians();
  }
totalRequests = 0;
newRequests = 0;
assignedRequests = 0;

loadRequests() {
  this.adminService.getAllRequests().subscribe(data => {
    this.requests = data;

    this.totalRequests = this.requests.length;
    this.newRequests = this.requests.filter(r => r.status === 'New').length;
    this.assignedRequests = this.requests.filter(r => r.status === 'Assigned').length;

    this.cdr.detectChanges();
  });
}




loadTechnicians() {
  this.adminService.getTechnicians().subscribe((data: any[]) => {
    this.technicians = data;
  });
}


assign(requestId: number) {

  if (!this.selectedTech[requestId]) {
    return;
  }

  const confirmed = confirm('Are you sure you want to assign this technician?');

  if (!confirmed) {
    return;
  }

  this.adminService.assignTechnician(
    requestId,
    this.selectedTech[requestId]
  ).subscribe(() => {
    this.loadRequests();
  });
}
logout() {
  // clear stored session (future-proof)
  localStorage.clear();
  sessionStorage.clear();

  // redirect to login / home
  this.router.navigate(['/']);
}

  
}
