import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const afteradminloginGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const router = inject(Router);
  if (!_AuthService.isAdmin) {
    return true;
  } else {
    router.navigate(['/NotFoundPage']);
    return false;
  }
};
