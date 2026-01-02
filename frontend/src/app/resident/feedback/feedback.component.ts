import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-header bg-gradient">
              <h2 class="card-title mb-0">⭐ Submit Feedback</h2>
              <small class="text-white-50">Request #{{ requestId }}</small>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label class="form-label"><strong>Rate Your Experience (1-5 Stars)</strong></label>
                  <div class="rating-stars">
                    <button 
                      *ngFor="let star of [1,2,3,4,5]" 
                      type="button"
                      (click)="feedback.rating = star"
                      [class.active]="feedback.rating >= star"
                      class="star-btn">
                      ⭐
                    </button>
                  </div>
                  <small class="text-muted d-block mt-2">
                    {{ feedback.rating }} out of 5 stars selected
                  </small>
                </div>

                <div class="mb-4">
                  <label for="comments" class="form-label">Comments (Optional)</label>
                  <textarea 
                    class="form-control" 
                    id="comments" 
                    [(ngModel)]="feedback.comments" 
                    name="comments" 
                    rows="4"
                    placeholder="Share your feedback about the service quality, professionalism, and overall experience...">
                  </textarea>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="isSubmitting">
                    <span *ngIf="!isSubmitting">📤 Submit Feedback</span>
                    <span *ngIf="isSubmitting">
                      <span class="spinner-border spinner-border-sm me-2"></span>Submitting...
                    </span>
                  </button>
                </div>
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
    .rating-stars {
      display: flex;
      gap: 10px;
      font-size: 40px;
    }
    .star-btn {
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0.3;
      transform: scale(1);
      transition: all 0.2s;
      padding: 0;
    }
    .star-btn:hover,
    .star-btn.active {
      opacity: 1;
      transform: scale(1.2);
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
export class FeedbackComponent implements OnInit {
  feedback = { rating: 5, comments: '' };
  requestId: any;
  message = '';
  isSuccess = false;
  isSubmitting = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  onSubmit(): void {
    if (!this.requestId) {
      this.message = 'Invalid request ID';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    const payload = { 
      feedback_rating: this.feedback.rating, 
      feedback_comments: this.feedback.comments 
    };

    this.http.post(`http://localhost:3001/api/resident/feedback/${this.requestId}`, payload).subscribe({
      next: (response: any) => {
        this.message = 'Thank you! Your feedback has been submitted successfully.';
        this.isSuccess = true;
        this.isSubmitting = false;
        this.feedback = { rating: 5, comments: '' };
        setTimeout(() => this.message = '', 5000);
      },
      error: (error: any) => {
        this.message = 'Failed to submit feedback: ' + (error.error?.error || error.statusText);
        this.isSuccess = false;
        this.isSubmitting = false;
      }
    });
  }
}
