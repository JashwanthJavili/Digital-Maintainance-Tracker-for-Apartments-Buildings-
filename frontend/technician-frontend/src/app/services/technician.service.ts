import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private API_URL = 'http://localhost:3000/api/technician';

  constructor(private http: HttpClient) {}

  getAssignedRequests(technicianId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/requests/${technicianId}`);
  }

  updateRequestStatus(requestId: number, status: string, notes?: string): Observable<any> {
    return this.http.put(`${this.API_URL}/request/${requestId}/status`, { status, notes });
  }

  getRequestDetails(requestId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/request/${requestId}`);
  }

  changePassword(payload: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/users/change-password', payload);
  }
}
