import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
        <div class="login-header">
          <h1>🔄 Redirecting...</h1>
          <p>Setting up your Admin session</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .login-header h1 {
      color: #ff6600;
      margin: 0 0 10px 0;
      font-size: 28px;
    }

    .login-header p {
      color: #666;
      margin: 0;
      font-size: 14px;
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
          this.router.navigate(['/admin/dashboard']);
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
