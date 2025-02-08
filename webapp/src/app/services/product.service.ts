import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment.development';
import { PReview } from '../viewmodel/preview';

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
    model: FormData
  ): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(
      `${environment.baseURL}/product`,
      model
    );
  }
  updateProduct(
    prdId: string,
    model: FormData
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${environment.baseURL}/product/${prdId}`,
      model
    );
  }
  deleteProduct(prdId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.baseURL}/product/${prdId}`
    );
  }
}
