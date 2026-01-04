import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TechnicianGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Check if user is logged in
    if (!token || !userStr) {
      alert('⚠️ Please login to access this page');
      window.location.href = 'http://localhost:4201/login';
      return false;
    }
    
    try {
      const user = JSON.parse(userStr);
      
      // Role-based access: Only Technicians can access
      if (user.role === 'Technician') {
        return true;
      }
      
      // Unauthorized user - display user-friendly message
      alert('❌ Access Denied: Only technicians can access this page');
      
      // Redirect based on actual role
      if (user.role === 'Resident') {
        window.location.href = 'http://localhost:4201/maintenance/new';
      } else if (user.role === 'Admin') {
        window.location.href = 'http://localhost:4200/admin/dashboard';
      } else {
        window.location.href = 'http://localhost:4201/login';
      }
      
      return false;
    } catch (error) {
      console.error('Error validating user access:', error);
      alert('⚠️ Session error. Please login again');
      window.location.href = 'http://localhost:4201/login';
      return false;
    }
  }
}
