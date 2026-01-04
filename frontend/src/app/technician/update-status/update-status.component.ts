import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TechnicianService } from '../technician.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.css'],
})
export class UpdateStatusComponent {
  requestId!: number;
  status = 'In-Progress';

  constructor(
    private route: ActivatedRoute,
    private technicianService: TechnicianService,
    private router: Router
  ) {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
  }

  submit() {
    this.technicianService.updateStatus(this.requestId, this.status).subscribe({
      next: () => {
        alert('Status updated successfully');
        this.router.navigate(['/technician/dashboard']);
      },
      error: () => alert('Failed to update status'),
    });
  }
}
