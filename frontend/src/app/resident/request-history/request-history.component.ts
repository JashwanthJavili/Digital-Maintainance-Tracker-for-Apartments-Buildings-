import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-gradient">
              <h2 class="card-title mb-0">📋 My Maintenance Requests</h2>
            </div>
            <div class="card-body">
              <div *ngIf="isLoading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div *ngIf="!isLoading && requests.length === 0" class="alert alert-info" role="alert">
                <strong>📭 No Requests Found</strong>
                <br>You haven't submitted any maintenance requests yet.
              </div>

              <div *ngIf="!isLoading && requests.length > 0" class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Category</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let req of requests">
                      <td><strong>#{{ req.id }}</strong></td>
                      <td>
                        <span class="badge bg-secondary">{{ req.category }}</span>
                      </td>
                      <td>{{ req.title || req.description.substring(0, 30) + '...' }}</td>
                      <td>
                        <span [class]="'badge status-' + (req.status || 'New').toLowerCase()">
                          {{ req.status || 'New' }}
                        </span>
                      </td>
                      <td>{{ req.created_at | date: 'short' }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary" (click)="viewDetails(req.id)">
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger mt-3" role="alert">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
    }
    .card-title {
      font-size: 24px;
    }
    .table-hover tbody tr:hover {
      background-color: rgba(102, 126, 234, 0.05);
    }
    .status-new { background: #ffc107 !important; }
    .status-assigned { background: #17a2b8 !important; }
    .status-in-progress { background: #0d6efd !important; }
    .status-resolved { background: #198754 !important; }
    .btn-outline-primary {
      color: #667eea;
      border-color: #667eea;
    }
    .btn-outline-primary:hover {
      background-color: #667eea;
      border-color: #667eea;
    }
  `]
})
export class RequestHistoryComponent implements OnInit {
  requests: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    const residentId = 1;
    this.http.get<any>(`http://localhost:3001/api/resident/requests/${residentId}`).subscribe({
      next: (response: any) => {
        this.requests = response.data || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load requests: ' + (error.error?.error || error.statusText);
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  viewDetails(requestId: number): void {
    alert(`Request #${requestId} - Details view coming soon!`);
  }
}
