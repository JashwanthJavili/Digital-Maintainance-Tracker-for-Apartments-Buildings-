import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'technician',
    loadChildren: () =>
      import('./technician/technician.module').then((m) => m.TechnicianModule),
  },
  { path: '', redirectTo: 'technician/dashboard', pathMatch: 'full' },
];
