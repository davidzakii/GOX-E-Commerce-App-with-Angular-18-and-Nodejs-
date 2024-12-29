import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  headers = new HttpHeaders({
    'content-type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.baseURL}/category`);
  }
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${environment.baseURL}/category/${id}`);
  }
  addNewCategory(newCategory: Category): Observable<Category> {
    return this.http.post<Category>(
      `${environment.baseURL}/category`,
      newCategory,
      {
        headers: this.headers,
      }
    );
  }
  updateCategory(
    newCategory: Category,
    id: string
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${environment.baseURL}/category/${id}`,
      newCategory,
      { headers: this.headers }
    );
  }
  deleteCategory(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.baseURL}/category/${id}`
    );
  }
}
