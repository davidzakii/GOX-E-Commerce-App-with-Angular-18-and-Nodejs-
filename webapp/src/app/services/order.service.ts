import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '../../environments/environment.development';
import { VMOrder } from '../viewmodel/vmorder';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  constructor() {}

  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${environment.baseURL}/order`, order);
  }
  getCustomerOrders(): Observable<VMOrder[]> {
    return this.http.get<VMOrder[]>(`${environment.baseURL}/customer/order`);
  }
  getOrders(): Observable<VMOrder[]> {
    return this.http.get<VMOrder[]>(`${environment.baseURL}/order`);
  }
  getOrderById(orderId: string): Observable<VMOrder> {
    return this.http.get<VMOrder>(`${environment.baseURL}/order/${orderId}`);
  }
  updateOrderStatus(orderId: string, status: string): Observable<VMOrder> {
    return this.http.patch<VMOrder>(
      `${environment.baseURL}/order/updateStatus/${orderId}`,
      {
        status: status,
      }
    );
  }
  updateOrderPaid(orderId: string, paid: boolean): Observable<VMOrder> {
    return this.http.patch<VMOrder>(
      `${environment.baseURL}/order/updatePaid/${orderId}`,
      {
        paid: paid,
      }
    );
  }
}
