import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private API_URL = 'http://localhost:3000/api/admin';

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
    return this.http.post(`${this.API_URL}/assign`, {
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
  
  // Generate user ID
  generateUserId(role: string, mobile: string, roomNumber?: string) {
    let url = `http://localhost:3000/api/users/generate-id?role=${role}&mobile=${mobile}`;
    if (roomNumber) {
      url += `&roomNumber=${roomNumber}`;
    }
    return this.http.get<any>(url);
  }
  
  // Create new user
  createUser(userData: any) {
    return this.http.post<any>('http://localhost:3000/api/users', userData);
  }

  // Change password
  changePassword(payload: any) {
    return this.http.post<any>('http://localhost:3000/api/users/change-password', payload);
  }
}
