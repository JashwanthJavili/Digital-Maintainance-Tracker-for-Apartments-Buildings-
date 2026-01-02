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
    // For resident module, we check if user role is allowed
    // In a real app, this would check authentication tokens
    const userRole = localStorage.getItem('userRole') || 'Resident';
    
    if (userRole !== 'Resident') {
      alert('❌ Access Denied: Only residents can access this page');
      this.router.navigate(['/']);
      return false;
    }
    
    return true;
  }
}
