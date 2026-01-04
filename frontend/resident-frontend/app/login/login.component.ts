import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="icon-container">
          <img *ngIf="!hideImage" [src]="logoSrc" (error)="onLogoError()" alt="Sri Srinivasa Nilayam" class="logo-image" />
        </div>

        <h1 class="apartment-name">Sri Srinivasa Nilayam</h1>
        <p class="tagline">A peaceful place to live</p>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="userId">User ID</label>
            <input 
              type="text" 
              id="userId" 
              [(ngModel)]="user_id" 
              name="userId" 
              placeholder="Enter your User ID (e.g. SSNF001)"
              required
              [disabled]="isLoading">
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="Enter your password"
              required
              [disabled]="isLoading">
          </div>

          <button type="submit" class="btn-login" [disabled]="isLoading">
            <span *ngIf="!isLoading">Login</span>
            <span *ngIf="isLoading">Logging in...</span>
          </button>
        </form>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="login-footer">
          <div class="footer-line">Sri Srinivasa Nilayam — Managed digitally for residents & staff</div>
          <div class="footer-line small">This application helps residents raise maintenance requests and track service status efficiently.</div>
          <div class="footer-line small">For support, contact Apartment Admin.</div>
          <div class="footer-copyright">© 2025 Sri Srinivasa Nilayam. All rights reserved.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FAF3E0 0%, #FFFEF5 100%);
      padding: 20px;
      font-family: 'Roboto', 'Open Sans', 'Segoe UI', sans-serif;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      width: 100%;
      max-width: 420px;
      padding: 32px 40px;
      text-align: center;
    }

    .icon-container {
      margin-bottom: 0;
    }

    .temple-icon {
      width: 56px;
      height: 56px;
      color: #D4A574;
      opacity: 0.9;
    }

    .logo-image {
      width: 240px;
      height: 240px;
      object-fit: contain;
    }

    .apartment-name {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 600;
      color: #4A3829;
      letter-spacing: 0.5px;
    }

    .tagline {
      margin: 0 0 28px;
      font-size: 14px;
      color: #8B7355;
      font-weight: 400;
    }

    form {
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 24px;
      text-align: left;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #5D4E37;
      font-weight: 500;
      font-size: 14px;
    }

    .form-group input {
      width: 100%;
      padding: 14px 16px;
      border: 1.5px solid #E5D5B7;
      border-radius: 8px;
      font-size: 15px;
      color: #4A3829;
      background: #FEFDFB;
      transition: all 0.3s ease;
    }

    .form-group input::placeholder {
      color: #B8A88A;
    }

    .form-group input:focus {
      outline: none;
      border-color: #D4A574;
      background: white;
      box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
    }

    .form-group input:disabled {
      background-color: #F5F0E8;
      cursor: not-allowed;
      opacity: 0.7;
    }

    .btn-login {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #D4A574 0%, #C89860 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(212, 165, 116, 0.25);
      letter-spacing: 0.5px;
    }

    .btn-login:hover:not(:disabled) {
      background: linear-gradient(135deg, #C89860 0%, #B8864C 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(212, 165, 116, 0.35);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      padding: 12px 16px;
      background: #FFF5F5;
      border: 1px solid #FEB2B2;
      border-radius: 6px;
      color: #C53030;
      font-size: 14px;
      text-align: center;
      margin-top: 16px;
    }

    .login-footer {
      padding: 18px 32px 32px;
      color: #7a6a56;
      font-size: 13px;
      text-align: center;
      border-top: 1px solid #f0e9df;
      margin-top: 10px;
    }

    .login-footer .footer-line {
      margin: 6px 0;
      color: #6b5843;
    }

    .login-footer .small {
      font-size: 12px;
      color: #86715a;
      opacity: 0.95;
    }

    .login-footer .footer-copyright {
      margin-top: 8px;
      font-size: 12px;
      color: #9a8770;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 40px 28px;
      }
      
      .apartment-name {
        font-size: 24px;
      }

      .tagline {
        font-size: 13px;
      }
    }
  `]
})
export class LoginComponent {
  user_id: string = '';
  password: string = '';
  errorMessage = '';
  isLoading = false;
  logoSrc = '/image.png';
  hideImage = false;

  constructor(private http: HttpClient, private router: Router) {}

  onLogoError() {
    this.hideImage = true;
  }

  onLogin(): void {
    if (!this.user_id || !this.password) {
      this.errorMessage = 'Please enter User ID and Password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>('http://localhost:3000/api/auth/login', { 
      user_id: this.user_id,
      password: this.password 
    }).subscribe({
      next: (authResponse: any) => {
        const token = authResponse.token;
        const user = authResponse.user;
        
        if (!token) {
          this.errorMessage = 'Authentication failed: No token received';
          this.isLoading = false;
          return;
        }
        
        const userData = JSON.stringify(user);
        
        if (user.role === 'Resident') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', userData);
          this.router.navigate(['/maintenance/new']);
        } else if (user.role === 'Technician') {
          const targetUrl = `http://localhost:4202/login?token=${encodeURIComponent(token)}&user=${encodeURIComponent(userData)}`;
          window.location.href = targetUrl;
        } else if (user.role === 'Admin') {
          const targetUrl = `http://localhost:4200/login?token=${encodeURIComponent(token)}&user=${encodeURIComponent(userData)}`;
          window.location.href = targetUrl;
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.error?.error || 'Invalid credentials';
        this.isLoading = false;
      }
    });
  }
}
