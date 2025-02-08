import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const afterLoginGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const router = inject(Router);

  return _AuthService.checkSessionValidity().pipe(
    map((isLoggedIn: any) => {
      if (isLoggedIn) {
        router.navigate(['/home']);
        return false;
      } else {
        return true;
      }
    }),
    catchError((err) => {
      console.error('Error in guard:', err);
      return of(true);
    })
  );
};
