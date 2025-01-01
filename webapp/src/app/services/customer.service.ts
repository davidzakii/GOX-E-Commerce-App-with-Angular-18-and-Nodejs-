import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment.development';
import { Category } from '../models/category';
import { Brand } from '../models/brand';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  constructor() {}

  getNewProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.baseURL}/customer/home/new-products`
    );
  }
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.baseURL}/customer/home/featured-products`
    );
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${environment.baseURL}/customer/categories`
    );
  }
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${environment.baseURL}/customer/brands`);
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.baseURL}/customer/products`);
  }
  search(
    searchTerm: string,
    categoryId: string,
    brandId: string,
    page: string,
    pageSize: string,
    sortBy: string,
    sortOrder: number
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.baseURL}/customer/product?searchTerm=${searchTerm}&categoryId=${categoryId}&brandId=${brandId}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
  }
}
