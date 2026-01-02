import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-header bg-gradient">
              <h2 class="card-title mb-0">📝 Submit Maintenance Request</h2>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="category" class="form-label">Category <span class="text-danger">*</span></label>
                  <select class="form-select" id="category" [(ngModel)]="formData.category" name="category" required>
                    <option value="">-- Select Category --</option>
                    <option value="Plumbing">🔧 Plumbing</option>
                    <option value="Electrical">⚡ Electrical</option>
                    <option value="Painting">🎨 Painting</option>
                    <option value="Other">📋 Other</option>
                  </select>
                  <small class="text-muted">Required field</small>
                </div>

                <div class="mb-3">
                  <label for="title" class="form-label">Title (Optional)</label>
                  <input type="text" class="form-control" id="title" [(ngModel)]="formData.title" name="title" placeholder="Brief title for your request">
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description <span class="text-danger">*</span></label>
                  <textarea class="form-control" id="description" [(ngModel)]="formData.description" name="description" rows="5" placeholder="Describe the issue in detail..." required></textarea>
                  <small class="text-muted">Required field</small>
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100" [disabled]="isSubmitting || !isFormValid()">
                  <span *ngIf="!isSubmitting">📤 Submit Request</span>
                  <span *ngIf="isSubmitting">
                    <span class="spinner-border spinner-border-sm me-2"></span>Submitting...
                  </span>
                </button>
              </form>

              <div *ngIf="message" [class]="'alert mt-3 ' + (isSuccess ? 'alert-success' : 'alert-danger')" role="alert">
                <strong>{{ isSuccess ? '✅ Success!' : '❌ Error!' }}</strong>
                <br>{{ message }}
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
    .text-danger {
      color: #dc3545;
    }
    .form-control:focus,
    .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      font-weight: 600;
      transition: transform 0.2s;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class MaintenanceRequestComponent {
  formData = { 
    resident_id: 1,
    category: '', 
    title: '', 
    description: '' 
  };
  message = '';
  isSuccess = false;
  isSubmitting = false;

  constructor(private http: HttpClient) {}

  isFormValid(): boolean {
    return this.formData.category.trim() !== '' && this.formData.description.trim() !== '';
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.message = 'Please fill in all required fields.';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.http.post('http://localhost:3001/api/resident/request', this.formData).subscribe({
      next: (response: any) => {
        this.message = 'Your maintenance request has been submitted successfully! Request ID: ' + response.requestId;
        this.isSuccess = true;
        this.isSubmitting = false;
        this.formData = { resident_id: 1, category: '', title: '', description: '' };
        setTimeout(() => this.message = '', 5000);
      },
      error: (error: any) => {
        this.message = 'Failed to submit request: ' + (error.error?.error || error.statusText || 'Unknown error');
        this.isSuccess = false;
        this.isSubmitting = false;
      }
    });
  }
}
