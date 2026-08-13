import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.userRole();

    // Si el usuario tiene sesión y su rol está dentro de los permitidos
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Si no tiene el rol adecuado, redirigir a su área correspondiente
    if (userRole === 'Patient') {
      router.navigate(['/patient']);
    } else if (userRole === 'Doctor' || userRole === 'Admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/auth']);
    }

    return false;
  };
};