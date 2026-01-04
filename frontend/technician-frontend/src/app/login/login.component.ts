import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>🔄 Redirecting...</mat-card-title>
          <mat-card-subtitle>Setting up your Technician session</mat-card-subtitle>
        </mat-card-header>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%);
    }

    .login-card {
      width: 400px;
      padding: 20px;
      text-align: center;
    }

    mat-card-title {
      font-size: 24px;
      text-align: center;
      color: #ff6600;
    }

    mat-card-subtitle {
      text-align: center;
      margin-bottom: 20px;
    }
  `]
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we have token and user from URL parameters (cross-origin redirect)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userStr = params['user'];
      
      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          
          // Store in localStorage for this app
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Redirect to dashboard
          this.router.navigate(['/technician/dashboard']);
        } catch (error) {
          console.error('Error parsing user data:', error);
          window.location.href = 'http://localhost:4201/login';
        }
      } else {
        // No token/user in URL, redirect to common login page
        window.location.href = 'http://localhost:4201/login';
      }
    });
  }
}
