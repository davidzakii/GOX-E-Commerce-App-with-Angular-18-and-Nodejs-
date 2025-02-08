import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PaypalService {
  private http = inject(HttpClient);
  constructor() {}
  
  createPayment(amount: string, currency: string = 'USD'): Observable<any> {
    return this.http.post(`${environment.baseURL}/paypal/create-payment`, {
      amount,
      currency,
    });
  }

  capturePayment(orderId: string): Observable<any> {
    return this.http.post(
      `${environment.baseURL}/paypal/capture-payment/${orderId}`,
      {}
    );
  }
}
