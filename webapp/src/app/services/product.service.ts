import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private headers = new HttpHeaders({
    'content-type': 'application/json',
  });
  private http = inject(HttpClient);
  constructor() {}
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.baseURL}/product`);
  }
  getProduct(prdId: string): Observable<Product> {
    return this.http.get<Product>(`${environment.baseURL}/product/${prdId}`);
  }
  addProduct(
    model: Product
  ): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(
      `${environment.baseURL}/product`,
      model,
      {
        headers: this.headers,
      }
    );
  }
  updateProduct(
    prdId: string,
    model: Product
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${environment.baseURL}/product/${prdId}`,
      model,
      {
        headers: this.headers,
      }
    );
  }
  deleteProduct(prdId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.baseURL}/product/${prdId}`
    );
  }
}
