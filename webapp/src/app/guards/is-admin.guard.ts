import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _AuthService = inject(AuthService);
  if (_AuthService.isAdmin) {
    return true;
  } else {
    router.navigate(['/admin/login']);
    return false;
  }
};
