import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <span class="apartment-title">Sri Srinivasa Nilayam</span>
        </div>
        <div class="nav-menu">
          <a href="/maintenance/new" class="nav-item active">New Request</a>
          <a href="/maintenance/history" class="nav-item">My Requests</a>
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
      <p class="quote-text">"Excellence is not an act, but a habit. We're here to serve you!"</p>
    </div>

    <div class="page-container">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="page-title">Submit Maintenance Request</h1>
          <p class="page-subtitle">Report an issue and our team will assist you</p>
        </div>

        <div class="form-card">
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Category <span class="required">*</span></label>
              <select class="form-control" [(ngModel)]="formData.category" name="category" required>
                <option value="">Select a category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Painting">Painting</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Description <span class="required">*</span></label>
              <textarea 
                class="form-control textarea-control" 
                [(ngModel)]="formData.description" 
                name="description" 
                rows="6" 
                placeholder="Describe the issue in detail..."
                required>
              </textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Upload Image (Optional)</label>
              <p class="field-help">Add a photo to help us understand the issue better</p>
              <div class="file-upload-wrapper">
                <input 
                  type="file" 
                  id="fileInput"
                  class="file-input" 
                  (change)="onFileSelect($event)"
                  accept="image/*">
                <label for="fileInput" class="file-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="upload-icon">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span *ngIf="!selectedFile">Choose Image</span>
                  <span *ngIf="selectedFile">{{ selectedFile.name }}</span>
                </label>
              </div>
            </div>

            <button type="submit" class="submit-button" [disabled]="isSubmitting || !isFormValid()">
              <span *ngIf="!isSubmitting">Submit Request</span>
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
    
    <!-- Change Password Modal -->
    <div class="modal-overlay" *ngIf="showChangePasswordModal" (click)="closeChangePasswordModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Change Password</h2>
          <button class="modal-close" (click)="closeChangePasswordModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form class="modal-form" (ngSubmit)="submitChangePassword()">
          <div class="form-group">
            <label class="form-label">Current Password *</label>
            <input type="password" class="form-input" [(ngModel)]="changePasswordData.currentPassword" name="currentPassword" placeholder="Enter current password" required />
          </div>
          
          <div class="form-group">
            <label class="form-label">New Password *</label>
            <input type="password" class="form-input" [(ngModel)]="changePasswordData.newPassword" name="newPassword" placeholder="Enter new password" required />
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirm New Password *</label>
            <input type="password" class="form-input" [(ngModel)]="changePasswordData.confirmPassword" name="confirmPassword" placeholder="Re-enter new password" required />
          </div>
          
          <div *ngIf="passwordError" class="error-message">{{ passwordError }}</div>
          <div *ngIf="passwordSuccess" class="success-message">{{ passwordSuccess }}</div>
          
          <div class="form-actions">
            <button type="button" class="cancel-button" (click)="closeChangePasswordModal()">Cancel</button>
            <button type="submit" class="submit-button" [disabled]="isChangingPassword">
              <span *ngIf="!isChangingPassword">Change Password</span>
              <span *ngIf="isChangingPassword">Changing...</span>
            </button>
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
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .room-badge {
      background: rgba(255,255,255,0.25);
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
    }
    
    .change-password-button {
      background: rgba(255,255,255,0.2);
      border: 1.5px solid rgba(255,255,255,0.4);
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 15px;
    }
    
    .change-password-button:hover {
      background: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.6);
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
      max-width: 720px;
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

    .form-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      padding: 40px;
    }

    .form-group {
      margin-bottom: 28px;
    }

    .form-label {
      display: block;
      margin-bottom: 10px;
      color: #5D4E37;
      font-weight: 600;
      font-size: 15px;
    }

    .required {
      color: #E74C3C;
      font-weight: 600;
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
      min-height: 140px;
    }

    .field-help {
      font-size: 13px;
      color: #8B7355;
      margin: 4px 0 10px 0;
    }

    .file-upload-wrapper {
      position: relative;
    }

    .file-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .file-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px 24px;
      border: 2px dashed #D4A574;
      border-radius: 10px;
      background: #FEFDFB;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #5D4E37;
      font-weight: 500;
      font-size: 15px;
    }

    .file-label:hover {
      background: #FAF8F5;
      border-color: #C89860;
    }

    .upload-icon {
      width: 24px;
      height: 24px;
      color: #D4A574;
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
    }
    
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px;
      border-bottom: 2px solid #FAF3E0;
    }
    
    .modal-title {
      font-size: 22px;
      font-weight: 700;
      color: #4A3829;
      margin: 0;
    }
    
    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: #666;
      transition: all 0.3s ease;
      border-radius: 8px;
    }
    
    .modal-close:hover {
      background: #FAF3E0;
      color: #4A3829;
    }
    
    .modal-form {
      padding: 24px;
    }
    
    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #E5D5C0;
      border-radius: 10px;
      font-size: 15px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #D4A574;
      box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
    }
    
    .error-message {
      padding: 10px 14px;
      background: #FFEBEE;
      border-left: 4px solid #F44336;
      color: #C62828;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    
    .success-message {
      padding: 10px 14px;
      background: #E8F5E9;
      border-left: 4px solid #4CAF50;
      color: #2E7D32;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
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
  `]
})
export class MaintenanceRequestComponent {
  formData = { 
    resident_id: 1,
    category: '', 
    description: '' 
  };
  selectedFile: File | null = null;
  userName = 'Guest';
  roomNumber = '';
  message = '';
  isSuccess = false;
  isSubmitting = false;
  
  // Profile Dropdown
  showProfileMenu = false;
  
  // Change Password Modal
  showChangePasswordModal = false;
  changePasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordError = '';
  passwordSuccess = '';
  isChangingPassword = false;

  constructor(private http: HttpClient) {
    // Get resident ID, name, and room number from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.formData.resident_id = userData.id;
      this.userName = userData.name;
      
      // Parse contact_info to get room number
      if (userData.contact_info) {
        try {
          const contactInfo = JSON.parse(userData.contact_info);
          this.roomNumber = contactInfo.room_number || '';
        } catch (e) {
          // If not JSON, use as-is (backward compatibility)
          this.roomNumber = userData.contact_info;
        }
      }
    }
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
      } else {
        this.message = 'Please select an image file';
        this.isSuccess = false;
        this.selectedFile = null;
      }
    }
  }

  logout(): void {
    localStorage.clear();
    window.location.href = 'http://localhost:4201/login';
  }

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
    const formData = new FormData();
    formData.append('resident_id', this.formData.resident_id.toString());
    formData.append('category', this.formData.category);
    formData.append('description', this.formData.description);
    
    if (this.selectedFile) {
      formData.append('media', this.selectedFile);
    }

    this.http.post('http://localhost:3000/api/requests', formData).subscribe({
      next: (response: any) => {
        this.message = 'Your maintenance request has been submitted successfully! Request ID: ' + response.requestId;
        this.isSuccess = true;
        this.isSubmitting = false;
        this.formData = { resident_id: this.formData.resident_id, category: '', description: '' };
        this.selectedFile = null;
        setTimeout(() => this.message = '', 5000);
      },
      error: (error: any) => {
        this.message = 'Failed to submit request: ' + (error.error?.error || error.statusText || 'Unknown error');
        this.isSuccess = false;
        this.isSubmitting = false;
      }
    });
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
  
  submitChangePassword(): void {
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
      this.passwordError = 'Password must be at least 4 characters long';
      return;
    }
    
    this.isChangingPassword = true;
    
    this.http.post('http://localhost:3000/api/users/change-password', {
      userId: this.formData.resident_id,
      currentPassword: this.changePasswordData.currentPassword,
      newPassword: this.changePasswordData.newPassword
    }).subscribe({
      next: (response: any) => {
        this.passwordSuccess = 'Password changed successfully!';
        this.isChangingPassword = false;
        setTimeout(() => {
          this.closeChangePasswordModal();
        }, 2000);
      },
      error: (error: any) => {
        this.passwordError = error.error?.error || 'Failed to change password';
        this.isChangingPassword = false;
      }
    });
  }
}
