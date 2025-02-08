import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment.development';
import { Category } from '../models/category';
import { Brand } from '../models/brand';
import { PReview } from '../viewmodel/preview';

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
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(
      `${environment.baseURL}/customer/categories/${id}`
    );
  }
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${environment.baseURL}/customer/brands`);
  }
  getBrandById(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${environment.baseURL}/customer/brands/${id}`);
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.baseURL}/customer/products`);
  }
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(
      `${environment.baseURL}/customer/products/${id}`
    );
  }
  addProductReviews(review: PReview, productId: string): Observable<PReview[]> {
    return this.http.post<PReview[]>(
      `${environment.baseURL}/customer/${productId}/reviews`,
      review
    );
  }

  getProductRating(productId: string): Observable<{ totalRating: number }> {
    return this.http.get<{ totalRating: number }>(
      `${environment.baseURL}/customer/product/${productId}/rating`
    );
  }
  getReviews(productId: string): Observable<PReview[]> {
    return this.http.get<PReview[]>(
      `${environment.baseURL}/customer/${productId}/reviews`
    );
  }
  search(
    searchTerm: string,
    categoryId: string,
    brandId: string,
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: number
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.baseURL}/customer/product?searchTerm=${searchTerm}&categoryId=${categoryId}&brandId=${brandId}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
  }
}
