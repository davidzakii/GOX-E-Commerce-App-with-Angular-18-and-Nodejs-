import { HttpInterceptorFn } from '@angular/common/http';

export const tokenHttpInterceptor: HttpInterceptorFn = (req, next) => {
  // إضافة withCredentials للسماح بإرسال الكوكيز مع الطلب
  req = req.clone({
    withCredentials: true,
  });

  return next(req);
};
