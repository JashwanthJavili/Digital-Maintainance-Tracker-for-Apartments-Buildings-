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
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <span class="apartment-title">Sri Srinivasa Nilayam</span>
        </div>
        <div class="nav-menu">
          <a href="/maintenance/new" class="nav-item">New Request</a>
          <a href="/maintenance/history" class="nav-item">My Requests</a>
          <button class="logout-button" (click)="logout()">Logout</button>
        </div>
      </div>
    </nav>

    <div class="page-container">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="page-title">Submit Feedback</h1>
          <p class="page-subtitle">Request #{{ requestId }} - Rate your service experience</p>
        </div>

        <div class="form-card">
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Service Rating <span class="required">*</span></label>
              <p class="helper-text">How would you rate the service quality?</p>
              <div class="rating-container">
                <button 
                  *ngFor="let star of [1,2,3,4,5]" 
                  type="button"
                  (click)="feedback.rating = star"
                  [class.selected]="feedback.rating >= star"
                  class="star-button">
                  <svg class="star-icon" viewBox="0 0 24 24" [attr.fill]="feedback.rating >= star ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>
              </div>
              <p class="rating-label">{{ feedback.rating }} out of 5 stars</p>
            </div>

            <div class="form-group">
              <label class="form-label">Comments (Optional)</label>
              <textarea 
                class="form-control textarea-control" 
                [(ngModel)]="feedback.comments" 
                name="comments" 
                rows="5"
                placeholder="Share any additional feedback about the service quality or professionalism...">
              </textarea>
            </div>

            <button type="submit" class="submit-button" [disabled]="isSubmitting">
              <span *ngIf="!isSubmitting">Submit Feedback</span>
              <span *ngIf="isSubmitting">
                <span class="spinner"></span>Submitting...
              </span>
            </button>
          </form>

          <div *ngIf="message" [class]="'alert-message ' + (isSuccess ? 'success' : 'error')">
            <strong>{{ isSuccess ? 'Success!' : 'Error!' }}</strong>
            <p>{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .main-nav {
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .apartment-title {
      font-size: 20px;
      font-weight: 600;
      color: white;
      letter-spacing: 0.3px;
    }

    .nav-menu {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .nav-item {
      color: rgba(255,255,255,0.95);
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 15px;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.15);
      color: white;
    }

    .logout-button {
      background: rgba(255,255,255,0.2);
      border: 1.5px solid rgba(255,255,255,0.4);
      color: white;
      padding: 10px 24px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 15px;
      margin-left: 8px;
    }

    .logout-button:hover {
      background: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.6);
    }

    .page-container {
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #FAF3E0 0%, #FFFEF5 100%);
      padding: 40px 20px;
    }

    .content-wrapper {
      max-width: 680px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
      text-align: center;
    }

    .page-title {
      font-size: 32px;
      font-weight: 600;
      color: #4A3829;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      font-size: 15px;
      color: #8B7355;
      font-weight: 400;
    }

    .form-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      padding: 40px;
    }

    .form-group {
      margin-bottom: 32px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      color: #5D4E37;
      font-weight: 600;
      font-size: 15px;
    }

    .helper-text {
      color: #8B7355;
      font-size: 14px;
      margin-bottom: 16px;
      margin-top: 4px;
    }

    .required {
      color: #E74C3C;
      font-weight: 600;
    }

    .rating-container {
      display: flex;
      gap: 12px;
      justify-content: center;
      padding: 20px 0;
    }

    .star-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      transition: all 0.3s ease;
      transform: scale(1);
    }

    .star-button:hover {
      transform: scale(1.15);
    }

    .star-button.selected {
      transform: scale(1.1);
    }

    .star-icon {
      width: 48px;
      height: 48px;
      color: #D4A574;
      transition: all 0.3s ease;
    }

    .star-button:not(.selected) .star-icon {
      opacity: 0.3;
    }

    .star-button.selected .star-icon {
      opacity: 1;
      filter: drop-shadow(0 2px 4px rgba(212, 165, 116, 0.3));
    }

    .rating-label {
      text-align: center;
      color: #5D4E37;
      font-weight: 600;
      font-size: 15px;
      margin-top: 12px;
    }

    .form-control {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #E5D5B7;
      border-radius: 10px;
      font-size: 15px;
      color: #4A3829;
      background: #FEFDFB;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #D4A574;
      background: white;
      box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.1);
    }

    .textarea-control {
      resize: vertical;
      min-height: 120px;
    }

    .submit-button {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);
      margin-top: 12px;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 165, 116, 0.4);
    }

    .submit-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.6s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert-message {
      padding: 16px 20px;
      border-radius: 10px;
      margin-top: 24px;
      border-left: 4px solid;
    }

    .alert-message.success {
      background: #EDF7ED;
      border-color: #4CAF50;
      color: #2E7D32;
    }

    .alert-message.error {
      background: #FFEBEE;
      border-color: #F44336;
      color: #C62828;
    }

    .alert-message strong {
      display: block;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .alert-message p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 16px;
      }

      .form-card {
        padding: 28px 24px;
      }

      .page-title {
        font-size: 26px;
      }

      .star-icon {
        width: 40px;
        height: 40px;
      }
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
      feedback_rating: this.feedback.rating
    };

    this.http.put(`http://localhost:3000/api/requests/${this.requestId}/feedback`, payload).subscribe({
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

  logout(): void {
    localStorage.clear();
    window.location.href = '/';
  }
}
