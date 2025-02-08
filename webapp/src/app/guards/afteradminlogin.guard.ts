import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const afteradminloginGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const router = inject(Router);
  let isAdmin: boolean = _AuthService.isAdminValue;
  if (!isAdmin) {
    router.navigate(['/NotFoundPage']);
    return false;
  } else {
    return true;
  }
};
