import { Component, OnInit } from '@angular/core';
import { TechnicianService } from '../technician.service';

@Component({
  selector: 'app-technician-dashboard',
  templateUrl: './technician-dashboard.component.html',
  styleUrls: ['./technician-dashboard.component.css'],
})
export class TechnicianDashboardComponent implements OnInit {
  requests: any[] = [];
  technicianId = 1; // demo technician id

  constructor(private technicianService: TechnicianService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.technicianService.getAssignedRequests(this.technicianId).subscribe({
      next: (res: any) => (this.requests = res.data || []),
      error: () => alert('Failed to load requests'),
    });
  }
}
