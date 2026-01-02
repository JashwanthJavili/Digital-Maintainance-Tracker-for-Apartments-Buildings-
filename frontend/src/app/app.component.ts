import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="#">
          🏢 Digital Maintenance Tracker
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/resident/new" routerLinkActive="active">New Request</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/resident/history" routerLinkActive="active">My Requests</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .bg-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .navbar-brand {
      font-size: 20px;
      color: white !important;
    }
    .nav-link {
      color: rgba(255,255,255,0.8) !important;
      transition: color 0.3s;
    }
    .nav-link:hover,
    .nav-link.active {
      color: white !important;
    }
  `]
})
export class AppComponent {
  title = 'Digital Maintenance Tracker';
}
