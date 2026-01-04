import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { TechnicianService } from '../services/technician.service';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatChipsModule
  ],
  template: `
    <!-- Navigation Header -->
    <nav class="tech-nav">
      <div class="nav-content">
        <div class="nav-brand">
          <h1 class="brand-title">Sri Srinivasa Nilayam</h1>
          <span class="brand-subtitle">Technician Dashboard</span>
        </div>
        <div class="nav-right">
          <span class="welcome-text">Welcome, {{ technicianName }}!</span>
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
                <div class="profile-avatar">{{ technicianName.charAt(0).toUpperCase() }}</div>
                <div class="profile-info">
                  <div class="profile-name">{{ technicianName }}</div>
                  <div class="profile-role">{{ technicianSpecialization }}</div>
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

    <!-- Quote Banner -->
    <div class="quote-banner">
      <p class="quote-text">"Excellence in service creates lasting satisfaction. Keep up the great work!"</p>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon assigned-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ getCountByStatus('Assigned') }}</h3>
            <p class="stat-label">Assigned</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon progress-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ getCountByStatus('In-Progress') }}</h3>
            <p class="stat-label">In Progress</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon resolved-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ getCountByStatus('Resolved') }}</h3>
            <p class="stat-label">Resolved</p>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <label class="filter-label">Filter Requests:</label>
        <select class="filter-select" [(ngModel)]="selectedFilter" (change)="onFilterChange()">
          <option value="all">All Requests</option>
          <option value="current">Current (Assigned & In Progress)</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <!-- Requests List -->
      <div *ngIf="requests.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
        </svg>
        <h3>No Assigned Requests</h3>
        <p>You don't have any requests assigned yet</p>
      </div>

      <div *ngFor="let request of filteredRequests" class="request-card" [class.expanded]="request.isExpanded">
        <div class="request-header" (click)="toggleRequestDetails(request)">
          <div class="header-left">
            <h3 class="request-title">Request #{{ request.id }}</h3>
            <span class="category-badge">{{ request.category }}</span>
            <span [class]="'status-badge status-' + request.status.toLowerCase().replace('-', '')">
              {{ request.status }}
            </span>
          </div>
          <div class="header-right">
            <svg class="expand-icon" [class.rotated]="request.isExpanded" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        <div class="request-content" *ngIf="request.isExpanded">
          <div class="workflow-indicator" *ngIf="request.status !== 'Resolved'">
            <span class="workflow-step" [class.active]="request.status === 'Assigned'">Assigned</span>
            <span class="workflow-arrow">→</span>
            <span class="workflow-step" [class.active]="request.status === 'In-Progress'">In Progress</span>
            <span class="workflow-arrow">→</span>
            <span class="workflow-step">Resolved</span>
          </div>

        <div class="request-details">
          <div class="detail-row">
            <span class="detail-label">Room Number:</span>
            <span class="detail-value">{{ request.resident_room }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">{{ request.resident_phone }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">{{ request.description }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Created:</span>
            <span class="detail-value">{{ request.created_at | date:'MMM d, y - h:mm a' }}</span>
          </div>
          <div class="detail-row" *ngIf="request.media">
            <span class="detail-label">Attached Image:</span>
            <span class="detail-value">
              <img [src]="'http://localhost:3000/uploads/' + request.media" [alt]="'Request ' + request.id" class="request-thumbnail" (click)="viewImage(request.media)" />
            </span>
          </div>
        </div>

        <div class="request-actions" *ngIf="request.status !== 'Resolved'">
          <div class="form-group">
            <label class="form-label">Update Status to:</label>
            <select class="form-control" [(ngModel)]="request.newStatus" (change)="onStatusChange(request)">
              <option *ngIf="request.status === 'Assigned'" value="In-Progress">Mark as In Progress</option>
              <option *ngIf="request.status === 'In-Progress'" value="Resolved">Mark as Resolved</option>
            </select>
          </div>

          <div class="form-group" *ngIf="request.newStatus === 'Resolved'">
            <label class="form-label">Resolution Notes <span style="color: #D4A574;">*</span></label>
            <textarea class="form-control" [(ngModel)]="request.newNote" rows="3" placeholder="Describe what was fixed or resolved..." required></textarea>
            <small style="color: #8B7355; font-size: 13px;">Required when marking as resolved</small>
          </div>

          <button class="update-button" (click)="updateRequest(request)">
            Update Request
          </button>
        </div>

        <div *ngIf="request.status === 'Resolved' && request.notes" class="resolved-notes">
          <h4 class="notes-heading">Resolution Notes:</h4>
          <p class="notes-text">{{ request.notes }}</p>
        </div>

        <div *ngIf="request.updateMessage" [class]="'alert-message ' + (request.updateSuccess ? 'success' : 'error')">
          {{ request.updateMessage }}
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
              [(ngModel)]="passwordData.currentPassword" 
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
              [(ngModel)]="passwordData.newPassword" 
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
              [(ngModel)]="passwordData.confirmPassword" 
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

    .tech-nav {
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .welcome-text {
      color: white;
      font-weight: 600;
      font-size: 15px;
      padding: 10px 16px;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
    }

    .nav-brand {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .brand-title {
      font-size: 22px;
      font-weight: 600;
      color: white;
      letter-spacing: 0.3px;
      margin: 0;
    }

    .brand-subtitle {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
    }

    .logout-button {
      background: rgba(255,255,255,0.2);
      border: 1.5px solid rgba(255,255,255,0.4);
      color: white;
      padding: 10px 28px;
      border-radius: 8px;
      cursor: pointer;
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
      font-weight: 600;
      font-size: 15px;
    }

    .logout-button:hover {
      background: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.6);
    }

    .quote-banner {
      background: linear-gradient(135deg, rgba(212, 165, 116, 0.08) 0%, rgba(200, 152, 96, 0.08) 100%);
      padding: 20px 32px;
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

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 32px;
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #FAF3E0 0%, #FFFEF5 100%);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon svg {
      width: 32px;
      height: 32px;
      color: white;
    }

    .assigned-icon {
      background: linear-gradient(135deg, #F093FB 0%, #F5576C 100%);
    }

    .progress-icon {
      background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
    }

    .resolved-icon {
      background: linear-gradient(135deg, #43E97B 0%, #38F9D7 100%);
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: #4A3829;
      margin: 0 0 4px 0;
      line-height: 1;
    }

    .stat-label {
      font-size: 15px;
      color: #8B7355;
      font-weight: 500;
      margin: 0;
    }

    .filter-section {
      background: white;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .filter-label {
      font-weight: 600;
      color: #5D4E37;
      font-size: 15px;
      white-space: nowrap;
    }

    .filter-select {
      flex: 1;
      max-width: 300px;
      padding: 10px 16px;
      border: 2px solid #E5D5B7;
      border-radius: 8px;
      font-size: 14px;
      color: #4A3829;
      background: white;
      cursor: pointer;
      transition-property: all;
      transition-duration: 0.3s;
      transition-timing-function: ease;
      font-family: inherit;
    }

    .filter-select:focus {
      outline: none;
      border-color: #D4A574;
      box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      color: #D4A574;
      margin: 0 auto 24px;
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
      font-size: 15px;
    }

    .request-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      margin-bottom: 16px;
      overflow: hidden;
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
      border: 2px solid transparent;
    }

    .request-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      border-color: #E5D5C0;
    }

    .request-card.expanded {
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border-color: #D4A574;
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      cursor: pointer;
      user-select: none;
      transition: background 0.2s ease;
    }

    .request-header:hover {
      background: #FAFAF8;
    }

    .request-content {
      padding: 0 24px 24px 24px;
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

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .expand-icon {
      width: 24px;
      height: 24px;
      color: #D4A574;
      transition: transform 0.3s ease;
    }

    .expand-icon.rotated {
      transform: rotate(180deg);
    }

    .request-title {
      font-size: 18px;
      font-weight: 700;
      color: #4A3829;
      margin: 0;
    }

    .category-badge {
      padding: 6px 16px;
      background: linear-gradient(135deg, #FFE5CC 0%, #FFD4A3 100%);
      color: #8B5A00;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
    }

    .workflow-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px 16px;
      background: #FAF3E0;
      border-radius: 12px;
      font-size: 11px;
      margin-bottom: 20px;
      border-left: 4px solid #D4A574;
    }

    .workflow-step {
      color: #8B7355;
      font-weight: 500;
      opacity: 0.5;
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
    }

    .workflow-step.active {
      color: #D4A574;
      font-weight: 700;
      opacity: 1;
      text-shadow: 0 1px 2px rgba(212, 165, 116, 0.2);
    }

    .workflow-arrow {
      color: #D4A574;
      font-weight: bold;
      font-size: 14px;
    }

    .status-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-assigned {
      background: #FFF4E6;
      color: #E67E22;
    }

    .status-inprogress {
      background: #E3F2FD;
      color: #2196F3;
    }

    .status-resolved {
      background: #E8F5E9;
      color: #4CAF50;
    }

    .request-details {
      margin-bottom: 24px;
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
      width: 120px;
      flex-shrink: 0;
      font-size: 14px;
    }

    .detail-value {
      color: #4A3829;
      flex: 1;
      font-size: 15px;
    }

    .request-thumbnail {
      max-width: 150px;
      max-height: 150px;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s ease;
      border: 2px solid #E5D5B7;
      object-fit: cover;
    }

    .request-thumbnail:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .request-actions {
      display: grid;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-weight: 600;
      color: #5D4E37;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-label::before {
      content: '\u2192';
      color: #D4A574;
      font-size: 18px;
      font-weight: bold;
    }

    .form-control {
      padding: 12px 16px;
      border: 2px solid #E5D5B7;
      border-radius: 10px;
      font-size: 15px;
      color: #4A3829;
      background: linear-gradient(135deg, #FFFEF9 0%, #FAF3E0 100%);
      font-weight: 600;
      cursor: pointer;
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
    }

    .form-control:hover {
      border-color: #D4A574;
      transform: translateY(-1px);
    }

    .form-control:focus {
      outline: none;
      border-color: #D4A574;
      box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
    }
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #D4A574;
      background: white;
      box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.1);
    }

    textarea.form-control {
      resize: vertical;
    }

    .update-button {
      padding: 14px 28px;
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
      box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);
      align-self: flex-start;
    }

    .update-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 165, 116, 0.4);
    }

    .alert-message {
      padding: 14px 18px;
      border-radius: 10px;
      margin-top: 20px;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    }

    .alert-message.success {
      background: #EDF7ED;
      color: #2E7D32;
      border: 1px solid #4CAF50;
    }

    .alert-message.error {
      background: #FFEBEE;
      color: #C62828;
      border: 1px solid #F44336;
    }

    .resolved-notes {
      margin-top: 20px;
      padding: 16px;
      background: #F0F7F0;
      border-left: 4px solid #4CAF50;
      border-radius: 8px;
    }

    .notes-heading {
      font-size: 15px;
      font-weight: 600;
      color: #2E7D32;
      margin-bottom: 8px;
    }

    .notes-text {
      font-size: 14px;
      color: #4A3829;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
    }

    @media (max-width: 768px) {
      .nav-content {
        flex-direction: column;
        gap: 16px;
        padding: 16px 20px;
      }

      .main-content {
        padding: 24px 20px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .request-card {
        padding: 20px;
      }

      .request-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .detail-label {
        width: 100px;
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
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
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
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
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
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
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
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
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
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
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
      transition-property: all; transition-duration: 0.3s; transition-timing-function: ease;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(200, 152, 96, 0.4);
    }
  `]
})
export class TechnicianDashboardComponent implements OnInit {
  technicianName = '';
  technicianId = 0;
  technicianSpecialization = '';
  requests: any[] = [];
  filteredRequests: any[] = [];
  selectedFilter: string = 'all';
  
  // Profile dropdown
  showProfileMenu = false;
  showChangePasswordModal = false;
  passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
  passwordError = '';
  passwordSuccess = '';

  constructor(
    private technicianService: TechnicianService,
    private router: Router
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.technicianName = user.name;
      this.technicianId = user.id;
      
      // Parse specialization from contact_info
      if (user.contact_info) {
        try {
          const contactInfo = typeof user.contact_info === 'string' 
            ? JSON.parse(user.contact_info) 
            : user.contact_info;
          this.technicianSpecialization = contactInfo.specialization || '';
        } catch (e) {
          this.technicianSpecialization = '';
        }
      }
      
      this.loadRequests();
    }
  }

  loadRequests() {
    this.technicianService.getAssignedRequests(this.technicianId).subscribe({
      next: (response) => {
        this.requests = response.data.map((req: any) => {
          let nextStatus = req.status;
          if (req.status === 'Assigned') {
            nextStatus = 'In-Progress';
          } else if (req.status === 'In-Progress') {
            nextStatus = 'Resolved';
          }
          
          return {
            ...req,
            newStatus: nextStatus,
            newNote: '',
            updateMessage: '',
            updateSuccess: false,
            isExpanded: false
          };
        });
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  toggleRequestDetails(request: any) {
    request.isExpanded = !request.isExpanded;
  }

  onStatusChange(request: any) {
    request.updateMessage = '';
  }

  updateRequest(request: any) {
    const updates: any = {};
    
    if (request.newStatus !== request.status) {
      // Check if marking as Resolved without notes
      if (request.newStatus === 'Resolved' && (!request.newNote || !request.newNote.trim())) {
        request.updateMessage = 'Resolution notes are required when marking as Resolved';
        request.updateSuccess = false;
        return;
      }
      updates.status = request.newStatus;
    }
    
    if (request.newNote && request.newNote.trim()) {
      updates.notes = request.newNote.trim();
    }

    if (Object.keys(updates).length === 0) {
      request.updateMessage = 'No changes to update';
      request.updateSuccess = false;
      return;
    }

    this.technicianService.updateRequestStatus(request.id, updates.status, updates.notes).subscribe({
      next: (response) => {
        request.updateMessage = 'Request updated successfully!';
        request.updateSuccess = true;
        request.status = request.newStatus;
        request.newNote = '';
        setTimeout(() => {
          request.updateMessage = '';
        }, 3000);
      },
      error: (error) => {
        request.updateMessage = 'Failed to update request';
        request.updateSuccess = false;
      }
    });
  }

  getCountByStatus(status: string): number {
    return this.requests.filter(r => r.status === status).length;
  }

  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredRequests = this.requests;
    } else if (this.selectedFilter === 'current') {
      this.filteredRequests = this.requests.filter(r => 
        r.status === 'Assigned' || r.status === 'In-Progress'
      );
    } else if (this.selectedFilter === 'resolved') {
      this.filteredRequests = this.requests.filter(r => r.status === 'Resolved');
    }
  }

  onFilterChange() {
    this.applyFilter();
  }

  viewImage(filename: string) {
    window.open('http://localhost:3000/uploads/' + filename, '_blank');
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
    this.showProfileMenu = false;
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  submitPasswordChange() {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.passwordError = 'All fields are required';
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError = 'New passwords do not match';
      return;
    }

    if (this.passwordData.newPassword.length < 4) {
      this.passwordError = 'New password must be at least 4 characters';
      return;
    }

    const payload = {
      user_id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).user_id : '',
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    this.technicianService.changePassword(payload).subscribe({
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

