import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const router = inject(Router);
  let isUserLoggedIn: boolean = _AuthService.isUserLoggedInValue;
  if (isUserLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
