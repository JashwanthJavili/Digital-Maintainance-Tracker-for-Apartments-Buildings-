import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private API_URL = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  // Get all requests
  getAllRequests() {
    return this.http.get<any[]>(`${this.API_URL}/requests`);
  }

  // ✅ Get technicians (THIS WAS MISSING)
  getTechnicians() {
    return this.http.get<any[]>(`${this.API_URL}/technicians`);
  }

  // Assign technician
  assignTechnician(requestId: number, technicianId: number) {
    return this.http.put(`${this.API_URL}/assign`, {
      requestId,
      technicianId
    });
  }

  // Update status
  updateStatus(requestId: number, status: string) {
    return this.http.put(`${this.API_URL}/status`, {
      requestId,
      status
    });
  }
}
