import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AdminService } from '../services/admin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatSelectModule,
    MatButtonModule,
     MatSidenavModule,
     RouterModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

displayedColumns: string[] = [
  'id',
  'category',
  'description',
  'technician',
  'status',
  'action'
];

  requests: any[] = [];
  filteredRequests: any[] = [];
  technicians: any[] = [];
  selectedTech: { [key: number]: number } = {};
  selectedFilter: string = 'all';
  userName = 'Admin';
  showProfileMenu = false;
  showChangePasswordModal = false;
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordError = '';
  passwordSuccess = '';
  progressRequests = 0;
  resolvedRequests = 0;
  
  // Add User Modal
  showAddUserModal = false;
  newUser = {
    role: '',
    user_id: '',
    name: '',
    mobile: ''
  };
  
  newUserDetails = {
    room_number: '',
    num_members: '',
    address: ''
  };
  
  specializations = {
    plumbing: false,
    electrical: false,
    painting: false,
    other: false
  };

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get admin name from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName = userData.name;
    }
    
    this.loadRequests();
    this.loadTechnicians();
  }
totalRequests = 0;
newRequests = 0;
assignedRequests = 0;

loadRequests() {
  this.adminService.getAllRequests().subscribe((response: any) => {
    this.requests = response.data || response;

    this.totalRequests = this.requests.length;
    this.newRequests = this.requests.filter(r => r.status === 'New').length;
    this.assignedRequests = this.requests.filter(r => r.status === 'Assigned').length;
    this.progressRequests = this.requests.filter(r => r.status === 'In-Progress').length;
    this.resolvedRequests = this.requests.filter(r => r.status === 'Resolved').length;

    this.applyFilter();
    this.cdr.detectChanges();
  });
}




loadTechnicians() {
  this.adminService.getTechnicians().subscribe((response: any) => {
    this.technicians = response.data || response;
  });
}


assign(requestId: number) {

  if (!this.selectedTech[requestId]) {
    return;
  }

  const confirmed = confirm('Are you sure you want to assign this technician?');

  if (!confirmed) {
    return;
  }

  this.adminService.assignTechnician(
    requestId,
    this.selectedTech[requestId]
  ).subscribe(() => {
    this.loadRequests();
  });
}

applyFilter() {
  if (this.selectedFilter === 'all') {
    this.filteredRequests = this.requests;
  } else if (this.selectedFilter === 'current') {
    this.filteredRequests = this.requests.filter(r => 
      r.status === 'New' || r.status === 'Assigned' || r.status === 'In-Progress'
    );
  } else if (this.selectedFilter === 'resolved') {
    this.filteredRequests = this.requests.filter(r => r.status === 'Resolved');
  }
}

onFilterChange() {
  this.applyFilter();
}

  viewImage(filename: string) {
    window.open('http://localhost:3000/uploads/' + filename, '_blank');
  }
  
  openAddUserModal() {
    this.showAddUserModal = true;
    this.resetNewUserForm();
  }
  
  closeAddUserModal() {
    this.showAddUserModal = false;
    this.resetNewUserForm();
  }
  
  resetNewUserForm() {
    this.newUser = {
      role: '',
      user_id: '',
      name: '',
      mobile: ''
    };
    this.newUserDetails = {
      room_number: '',
      num_members: '',
      address: ''
    };
    this.specializations = {
      plumbing: false,
      electrical: false,
      painting: false,
      other: false
    };
  }
  
  onRoleChange() {
    if (this.newUser.role) {
      this.newUser.user_id = '';
      // Clear details when role changes
      this.newUserDetails = {
        room_number: '',
        num_members: '',
        address: ''
      };
      this.specializations = {
        plumbing: false,
        electrical: false,
        painting: false,
        other: false
      };
    } else {
      this.newUser.user_id = '';
    }
  }
  
  onRoomNumberChange() {
    // Regenerate user ID when room number changes (for residents)
    if (this.newUser.role === 'Resident' && this.newUser.mobile && this.newUserDetails.room_number) {
      this.generateUserId();
    }
  }
  
  onMobileChange() {
    if (this.newUser.mobile) {
      this.generateUserId();
    }
  }
  
  isNewUserFormValid(): boolean {
    const hasBasicFields = this.newUser.role && this.newUser.user_id && this.newUser.name && this.newUser.mobile;
    
    if (this.newUser.role === 'Resident') {
      return !!(hasBasicFields && this.newUserDetails.room_number && this.newUserDetails.num_members);
    } else if (this.newUser.role === 'Technician') {
      const hasSpecialization = this.specializations.plumbing || this.specializations.electrical || 
                                this.specializations.painting || this.specializations.other;
      return !!(hasBasicFields && this.newUserDetails.address && hasSpecialization);
    } else if (this.newUser.role === 'Admin') {
      return !!(hasBasicFields && this.newUserDetails.address);
    }
    
    return false;
  }
  
  generateUserId() {
    if (!this.newUser.role || !this.newUser.mobile) {
      console.log('Cannot generate ID: role or mobile missing', { role: this.newUser.role, mobile: this.newUser.mobile });
      return;
    }
    
    // Validate mobile has at least 3 digits
    if (this.newUser.mobile.length < 3) {
      alert('Please enter at least 3 digits for mobile number');
      return;
    }
    
    // For residents, room number is required
    if (this.newUser.role === 'Resident' && !this.newUserDetails.room_number) {
      console.log('Room number required for resident');
      return;
    }
    
    this.adminService.generateUserId(this.newUser.role, this.newUser.mobile, this.newUserDetails.room_number).subscribe({
      next: (response: any) => {
        this.newUser.user_id = response.userId;
      },
      error: (error) => {
        console.error('Error generating user ID:', error);
        alert(error.error?.error || 'Failed to generate user ID. Please check the details.');
      }
    });
  }
  
  refreshUserId() {
    if (this.newUser.role && this.newUser.mobile) {
      this.generateUserId();
    }
  }
  
  submitNewUser() {
    if (!this.isNewUserFormValid()) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Build specialization string from checkboxes
    if (this.newUser.role === 'Technician') {
      const selected = [];
      if (this.specializations.plumbing) selected.push('Plumbing');
      if (this.specializations.electrical) selected.push('Electrical');
      if (this.specializations.painting) selected.push('Painting');
      if (this.specializations.other) selected.push('Other');
      this.newUserDetails.address = this.newUserDetails.address; // Keep address
      (this.newUserDetails as any).specialization = selected.join(', ');
    }
    
    // Build contact_info JSON
    const additionalInfo = {
      mobile: this.newUser.mobile,
      ...this.newUserDetails
    };
    
    const payload = {
      user_id: this.newUser.user_id,
      name: this.newUser.name,
      role: this.newUser.role,
      additionalInfo: additionalInfo
    };
    
    this.adminService.createUser(payload).subscribe({
      next: (response: any) => {
        const roleLabel = this.newUser.role === 'Resident' ? 'Resident' : this.newUser.role;
        alert(`${roleLabel} created successfully! Login ID: ${this.newUser.user_id}, Password: ${this.newUser.user_id}`);
        this.closeAddUserModal();
        this.loadTechnicians(); // Reload technician list
      },
      error: (error) => {
        console.error('Error creating user:', error);
        alert(error.error?.error || 'Failed to create user');
      }
    });
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  openChangePasswordModal() {
    this.showProfileMenu = false;
    this.showChangePasswordModal = true;
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  submitPasswordChange() {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.passwordError = 'All fields are required';
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError = 'New passwords do not match';
      return;
    }

    if (this.passwordData.newPassword.length < 4) {
      this.passwordError = 'Password must be at least 4 characters';
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const payload = {
      userId: user.user_id,
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    this.adminService.changePassword(payload).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully!';
        setTimeout(() => this.closeChangePasswordModal(), 2000);
      },
      error: (err) => {
        this.passwordError = err.error?.error || 'Failed to change password';
      }
    });
  }

  getPercentage(count: number): number {
    if (this.totalRequests === 0) return 0;
    const max = Math.max(this.newRequests, this.assignedRequests, this.progressRequests, this.resolvedRequests, 1);
    const percentage = (count / max) * 100;
    return Math.max(percentage, count > 0 ? 20 : 0); // Minimum 20% height if count > 0
  }

  getCategoryStats() {
    const categories = ['Plumbing', 'Electrical', 'Painting', 'Other'];
    const stats = categories.map(cat => {
      const count = this.requests.filter(r => r.category === cat).length;
      return {
        name: cat,
        count: count
      };
    });
    
    // Calculate max for percentage
    const maxCount = Math.max(...stats.map(s => s.count), 1);
    
    return stats.map(stat => ({
      ...stat,
      percentage: Math.max((stat.count / maxCount) * 100, stat.count > 0 ? 20 : 0) // Minimum 20% height if count > 0
    }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // redirect to login / home
    this.router.navigate(['/']);
  }

  
}
