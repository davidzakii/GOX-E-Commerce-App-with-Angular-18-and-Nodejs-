import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  headers = new HttpHeaders({
    'content-type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${environment.baseURL}/brand`);
  }
  getBrandById(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${environment.baseURL}/brand/${id}`);
  }
  addNewBrand(newCategory: Brand): Observable<Brand> {
    return this.http.post<Brand>(`${environment.baseURL}/brand`, newCategory, {
      headers: this.headers,
    });
  }
  updateBrand(newCategory: Brand, id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${environment.baseURL}/brand/${id}`,
      newCategory,
      { headers: this.headers }
    );
  }
  deleteBrand(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.baseURL}/brand/${id}`
    );
  }
}
