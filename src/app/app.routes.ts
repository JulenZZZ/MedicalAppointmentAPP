import { Routes } from '@angular/router';
import { AuthFormComponent } from './features/auth/auth-form/auth-form.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MyAppointmentsComponent } from './features/my-appointments/my-appointments.component';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/landing/landing.component')
      .then(m => m.LandingComponent)
  },
  { 
    path: 'auth', 
    component: AuthFormComponent 
  },
  { 
    path: 'patient', 
    canActivate: [authGuard, roleGuard(['Patient'])],
    loadComponent: () => import('./features/patient/patient-dashboard/patient-dashboard.component')
      .then(m => m.PatientDashboardComponent)
  },
  { 
    path: 'admin', 
    canActivate: [authGuard, roleGuard(['Doctor', 'Admin'])],
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'my-appointments',
    component: MyAppointmentsComponent,
    canActivate: [authGuard] // Asegura que solo un usuario con Token acceda
  },
  { 
    path: '**', 
    redirectTo: 'auth' 
  }
];