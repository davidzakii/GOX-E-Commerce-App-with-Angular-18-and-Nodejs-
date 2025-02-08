import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  loaderService.show(); // إظهار اللودر عند بدء الطلب

  return next(req).pipe(
    finalize(() => {
      loaderService.hide(); // إخفاء اللودر عند انتهاء الطلب
    })
  );
};
