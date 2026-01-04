import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-history',
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
          <a href="/maintenance/history" class="nav-item active">My Requests</a>
          <div class="user-profile-dropdown">
            <button class="profile-button" [class.active]="showProfileMenu" (click)="toggleProfileMenu()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="chevron">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="profile-menu" *ngIf="showProfileMenu">
              <div class="profile-header">
                <div class="profile-avatar">{{ userName.charAt(0).toUpperCase() }}</div>
                <div class="profile-info">
                  <div class="profile-name">{{ userName }}</div>
                  <div class="profile-role">Room {{ roomNumber }}</div>
                </div>
              </div>
              <div class="profile-actions">
                <button class="profile-action" (click)="openChangePasswordModal()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>
                  Change Password
                </button>
                <button class="profile-action logout" (click)="logout()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="quote-banner">
      <p class="quote-text">"Your comfort is our priority. We're always here for you!"</p>
    </div>

    <div class="page-container">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="page-title">My Maintenance Requests</h1>
          <p class="page-subtitle">Track the status of your submitted requests</p>
        </div>

        <div class="content-card">
          <div *ngIf="isLoading" class="loading-state">
            <div class="spinner-large"></div>
            <p>Loading your requests...</p>
          </div>

          <div *ngIf="!isLoading && requests.length === 0" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
            <h3>No Requests Yet</h3>
            <p>You haven't submitted any maintenance requests</p>
            <a href="/maintenance/new" class="primary-link">Create New Request</a>
          </div>

          <div *ngIf="!isLoading && requests.length > 0" class="requests-list">
            <div *ngFor="let req of requests" class="request-item">
              <div class="request-header" (click)="toggleDetails(req.id)" style="cursor: pointer;">
                <div class="request-id-section">
                  <span class="request-id">#{{ req.id }}</span>
                  <span [class]="'status-badge status-' + (req.status || 'new').toLowerCase().replace('-', '')">
                    {{ req.status || 'New' }}
                  </span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="request-category">{{ req.category }}</span>
                  <svg class="expand-icon" [class.expanded]="expandedRequestId === req.id" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              
              <div class="request-body">
                <p class="request-description">{{ req.description }}</p>
                <div class="request-meta">
                  <span class="meta-item">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {{ req.created_at | date: 'MMM d, y - h:mm a' }}
                  </span>
                </div>
              </div>

              <div *ngIf="expandedRequestId === req.id" class="request-details-expanded">
                <div class="detail-section">
                  <h4 class="detail-heading">Full Details</h4>
                  <div class="detail-row">
                    <span class="detail-label">Request ID:</span>
                    <span class="detail-value">#{{ req.id }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">{{ req.category }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">{{ req.status }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Technician:</span>
                    <span class="detail-value">{{ req.technician_name || 'Not Assigned' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Submitted:</span>
                    <span class="detail-value">{{ req.created_at | date: 'MMM d, y - h:mm a' }}</span>
                  </div>
                  <div class="detail-row" *ngIf="req.feedback_rating">
                    <span class="detail-label">Rating:</span>
                    <span class="detail-value">{{ req.feedback_rating }} / 5</span>
                  </div>
                </div>
                <div class="detail-section" *ngIf="req.status === 'Resolved' && req.notes">
                  <h4 class="detail-heading">Resolution Notes</h4>
                  <div class="notes-box">
                    <p class="notes-text">{{ req.notes }}</p>
                  </div>
                </div>
                <div class="detail-section" *ngIf="req.media">
                  <h4 class="detail-heading">Attached Image</h4>
                  <div class="image-container">
                    <img [src]="'http://localhost:3000/uploads/' + req.media" [alt]="'Request #' + req.id" class="request-image" />
                  </div>
                </div>
                <div class="detail-section" *ngIf="!req.media">
                  <p class="no-image-text">No image attached to this request</p>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-alert">
            <strong>Error</strong>
            <p>{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal-overlay" *ngIf="showChangePasswordModal" (click)="closeChangePasswordModal()">
      <div class="modal-content password-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Change Password</h2>
          <button class="close-button" (click)="closeChangePasswordModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form (ngSubmit)="submitPasswordChange()" class="password-form">
          <div class="form-group">
            <label class="form-label">Current Password *</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="changePasswordData.currentPassword" 
              name="currentPassword"
              placeholder="Enter your current password"
              required 
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">New Password *</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="changePasswordData.newPassword" 
              name="newPassword"
              placeholder="Enter new password (min 4 characters)"
              required 
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirm New Password *</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="changePasswordData.confirmPassword" 
              name="confirmPassword"
              placeholder="Re-enter new password"
              required 
            />
          </div>
          
          <div class="error-message" *ngIf="passwordError">
            {{ passwordError }}
          </div>
          
          <div class="success-message" *ngIf="passwordSuccess">
            {{ passwordSuccess }}
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-button" (click)="closeChangePasswordModal()">Cancel</button>
            <button type="submit" class="submit-button">Change Password</button>
          </div>
        </form>
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

    .nav-item.active {
      background: rgba(255,255,255,0.25);
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

    .welcome-text {
      color: white;
      font-weight: 600;
      font-size: 15px;
      margin-right: 16px;
      padding: 10px 16px;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
    }

    .quote-banner {
      background: linear-gradient(135deg, rgba(212, 165, 116, 0.08) 0%, rgba(200, 152, 96, 0.08) 100%);
      padding: 20px 20px;
      text-align: center;
      border-bottom: 2px solid rgba(212, 165, 116, 0.15);
    }

    .quote-text {
      font-size: 16px;
      color: #5D4E37;
      font-style: italic;
      font-weight: 500;
      margin: 0;
      letter-spacing: 0.3px;
    }

    .page-container {
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #FAF3E0 0%, #FFFEF5 100%);
      padding: 40px 20px;
    }

    .content-wrapper {
      max-width: 1000px;
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
      font-size: 16px;
      color: #8B7355;
      font-weight: 400;
    }

    .content-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      padding: 32px;
      min-height: 400px;
    }

    .loading-state {
      text-align: center;
      padding: 60px 20px;
      color: #8B7355;
    }

    .spinner-large {
      width: 48px;
      height: 48px;
      border: 4px solid #E5D5B7;
      border-radius: 50%;
      border-top-color: #D4A574;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      color: #D4A574;
      margin-bottom: 24px;
      opacity: 0.6;
    }

    .empty-state h3 {
      font-size: 22px;
      color: #4A3829;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .empty-state p {
      color: #8B7355;
      margin-bottom: 24px;
      font-size: 15px;
    }

    .primary-link {
      display: inline-block;
      padding: 12px 28px;
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .primary-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);
    }

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .request-item {
      border: 2px solid #F5EFE7;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
      background: #FFFEF9;
    }

    .request-item:hover {
      border-color: #E5D5B7;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .request-id-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .request-id {
      font-size: 18px;
      font-weight: 700;
      color: #4A3829;
    }

    .status-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-new {
      background: #FFF4E6;
      color: #E67E22;
    }

    .status-assigned {
      background: #E3F2FD;
      color: #2196F3;
    }

    .status-inprogress {
      background: #F3E5F5;
      color: #9C27B0;
    }

    .status-resolved {
      background: #E8F5E9;
      color: #4CAF50;
    }

    .request-category {
      padding: 6px 16px;
      background: #F5EFE7;
      color: #5D4E37;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .expand-icon {
      width: 20px;
      height: 20px;
      color: #8B7355;
      transition: transform 0.3s ease;
    }

    .expand-icon.expanded {
      transform: rotate(180deg);
    }

    .request-details-expanded {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #F5EFE7;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .detail-section {
      margin-bottom: 24px;
    }

    .detail-heading {
      font-size: 16px;
      font-weight: 600;
      color: #4A3829;
      margin-bottom: 16px;
    }

    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #F5EFE7;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
      color: #5D4E37;
      width: 140px;
      flex-shrink: 0;
    }

    .detail-value {
      color: #4A3829;
      flex: 1;
    }

    .image-container {
      display: flex;
      justify-content: center;
      padding: 16px;
      background: #FAF8F5;
      border-radius: 12px;
    }

    .request-image {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .no-image-text {
      text-align: center;
      color: #8B7355;
      font-style: italic;
      padding: 20px;
    }

    .notes-box {
      padding: 16px;
      background: #F0F7F0;
      border-left: 4px solid #4CAF50;
      border-radius: 8px;
    }

    .notes-text {
      margin: 0;
      color: #4A3829;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .request-body {
      margin-bottom: 16px;
    }

    .request-description {
      color: #5D4E37;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .request-meta {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #8B7355;
      font-size: 14px;
    }

    .icon {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .request-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .action-button {
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .view-btn {
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      color: white;
    }

    .view-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
    }

    .error-alert {
      padding: 16px 20px;
      border-radius: 10px;
      background: #FFEBEE;
      border-left: 4px solid #F44336;
      color: #C62828;
    }

    .error-alert strong {
      display: block;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .error-alert p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 16px;
      }

      .content-card {
        padding: 24px 20px;
      }

      .page-title {
        font-size: 26px;
      }

      .request-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    /* User Profile Dropdown */
    .user-profile-dropdown {
      position: relative;
      margin-left: auto;
    }

    .profile-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      border: 2px solid #E5D5C0;
      border-radius: 12px;
      padding: 10px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 600;
      color: #4A3829;
    }

    .profile-button:hover {
      background: #FAF3E0;
      border-color: #D4A574;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .profile-button svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .profile-button .chevron {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }

    .profile-button.active .chevron {
      transform: rotate(180deg);
    }

    .profile-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      min-width: 280px;
      background: white;
      border: 2px solid #E5D5C0;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      overflow: hidden;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px;
      background: linear-gradient(135deg, #FAF3E0 0%, #F5ECD7 100%);
      border-bottom: 2px solid #E5D5C0;
    }

    .profile-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
    }

    .profile-info {
      flex: 1;
      min-width: 0;
    }

    .profile-name {
      font-size: 16px;
      font-weight: 700;
      color: #4A3829;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .profile-role {
      font-size: 13px;
      color: #8B7355;
      font-weight: 500;
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      padding: 8px;
    }

    .profile-action {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: transparent;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 600;
      color: #4A3829;
      text-align: left;
    }

    .profile-action:hover {
      background: #FAF3E0;
      transform: translateX(4px);
    }

    .profile-action svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .profile-action.logout {
      color: #c94040;
    }

    .profile-action.logout:hover {
      background: #ffe5e5;
    }

    /* Password Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      padding: 0;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border: 2px solid #E5D5C0;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 30px;
      border-bottom: 2px solid #F5ECD7;
      background: linear-gradient(135deg, #FAF3E0 0%, #F5ECD7 100%);
    }

    .modal-title {
      font-size: 22px;
      font-weight: 700;
      color: #4A3829;
      margin: 0;
    }

    .close-button {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: #8B7355;
      transition: all 0.3s ease;
      border-radius: 8px;
    }

    .close-button:hover {
      background: rgba(212, 165, 116, 0.2);
      color: #4A3829;
    }

    .close-button svg {
      width: 24px;
      height: 24px;
    }

    .password-form {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #4A3829;
    }

    .form-input {
      padding: 12px 16px;
      border: 2px solid #E5D5C0;
      border-radius: 10px;
      font-size: 14px;
      transition: all 0.3s ease;
      background: white;
    }

    .form-input:focus {
      outline: none;
      border-color: #D4A574;
      box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
    }

    .error-message {
      padding: 12px 16px;
      background: #ffe5e5;
      color: #c94040;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      border: 2px solid #ffcccc;
    }

    .success-message {
      padding: 12px 16px;
      background: #e5f7e5;
      color: #3d8f3d;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      border: 2px solid #c6e6c6;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 10px;
      padding-top: 20px;
      border-top: 2px solid #FAF3E0;
    }

    .cancel-button {
      padding: 12px 28px;
      background: white;
      color: #666;
      border: 2px solid #E5D5C0;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-button:hover {
      background: #FAF3E0;
      color: #4A3829;
      border-color: #D4A574;
    }

    .submit-button {
      padding: 12px 28px;
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(200, 152, 96, 0.4);
    }
  `]
})
export class RequestHistoryComponent implements OnInit {
  requests: any[] = [];
  isLoading = true;
  errorMessage = '';
  residentId = 1;
  userName = 'Guest';
  roomNumber = '';
  expandedRequestId: number | null = null;
  
  // Profile Dropdown
  showProfileMenu = false;
  showChangePasswordModal = false;
  changePasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordError = '';
  passwordSuccess = '';

  constructor(private http: HttpClient) {
    // Get resident ID, name, and room number from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.residentId = userData.id;
      this.userName = userData.name;
      
      // Parse contact_info to get room number
      if (userData.contact_info) {
        try {
          const contactInfo = JSON.parse(userData.contact_info);
          this.roomNumber = contactInfo.room_number || '';
        } catch (e) {
          this.roomNumber = userData.contact_info;
        }
      }
    }
  }

  toggleDetails(requestId: number): void {
    if (this.expandedRequestId === requestId) {
      this.expandedRequestId = null;
    } else {
      this.expandedRequestId = requestId;
    }
  }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.http.get<any>(`http://localhost:3000/api/requests/resident/${this.residentId}`).subscribe({
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

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
    this.showProfileMenu = false;
    this.changePasswordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.changePasswordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  submitPasswordChange(): void {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.changePasswordData.currentPassword || !this.changePasswordData.newPassword || !this.changePasswordData.confirmPassword) {
      this.passwordError = 'All fields are required';
      return;
    }

    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmPassword) {
      this.passwordError = 'New passwords do not match';
      return;
    }

    if (this.changePasswordData.newPassword.length < 4) {
      this.passwordError = 'New password must be at least 4 characters';
      return;
    }

    const payload = {
      user_id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).user_id : '',
      currentPassword: this.changePasswordData.currentPassword,
      newPassword: this.changePasswordData.newPassword
    };

    this.http.post<any>('http://localhost:3000/api/users/change-password', payload).subscribe({
      next: (response) => {
        this.passwordSuccess = 'Password changed successfully!';
        setTimeout(() => {
          this.closeChangePasswordModal();
        }, 2000);
      },
      error: (error) => {
        this.passwordError = error.error.message || 'Failed to change password';
      }
    });
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/';
  }
}
