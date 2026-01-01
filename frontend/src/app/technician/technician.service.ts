import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TechnicianService {
  private baseUrl = 'http://localhost:3000/api/technician';

  constructor(private http: HttpClient) {}

  getAssignedRequests(technicianId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${technicianId}/requests`);
  }

  updateStatus(requestId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/status`, {
      status,
    });
  }
}
