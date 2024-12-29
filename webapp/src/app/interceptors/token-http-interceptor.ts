import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tokenHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const _AuthService = inject(AuthService);
  if (token) {
    try {
      const payload = _AuthService.decodeJwtPayload(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp > currentTime) {
        req = req.clone({
          setHeaders: {
            Authorization: token,
          },
        });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (e) {
      console.error('Invalid token:', e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return next(req);
};
