import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResidentGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Check if user is logged in
    if (!token || !user) {
      alert('⚠️ Please login to access this page');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const userData = JSON.parse(user);
      
      // Role-based access: Only Residents can access
      if (userData.role === 'Resident') {
        return true;
      }
      
      // Unauthorized user - display user-friendly message
      alert('❌ Access Denied: Only residents can access this page');
      
      // Redirect based on actual role
      if (userData.role === 'Admin') {
        window.location.href = 'http://localhost:4200/admin/dashboard';
      } else if (userData.role === 'Technician') {
        window.location.href = 'http://localhost:4202/technician/dashboard';
      } else {
        this.router.navigate(['/login']);
      }
      
      return false;
    } catch (error) {
      console.error('Error validating user access:', error);
      alert('⚠️ Session error. Please login again');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
