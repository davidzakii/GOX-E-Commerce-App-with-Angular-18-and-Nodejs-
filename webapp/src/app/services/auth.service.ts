import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authSubject: BehaviorSubject<boolean>;
  constructor() {
    this.authSubject = new BehaviorSubject<boolean>(this.isTokenValid());
  }
  registerUser(user: User): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.baseURL}/user/register`,
      user,
      {
        headers: new HttpHeaders({
          'content-type': 'application/json',
        }),
      }
    );
  }

  loginUser(
    user: User
  ): Observable<{ message: string } | { token: string; user: User }> {
    return this.http.post<{ message: string } | { token: string; user: User }>(
      `${environment.baseURL}/user/login`,
      user
    );
  }
  decodeBase64Url(base64Url: string): string {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const base64WithPadding = base64 + padding;

    try {
      const binaryString = atob(base64WithPadding);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    } catch (error) {
      console.error(`Base64 decoding failed. Input: ${base64Url}`, error);
      throw error;
    }
  }

  decodeJwtPayload(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1]; // Extract payload
      const payloadJson = this.decodeBase64Url(payloadBase64);
      return JSON.parse(payloadJson);
    } catch (error) {
      console.error('Error decoding JWT payload:', error);
      throw new Error('Invalid token payload.');
    }
  }
  private isTokenValid(): boolean {
    const token = localStorage.getItem('token') || '';
    if (token) {
      try {
        const payload = this.decodeJwtPayload(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
      } catch (e) {
        console.error('Inavlid token:', e);
        this.clearLocalStorage();
        return false;
      }
    } else {
      return false;
    }
  }

  private clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  userLoggedAsObservable(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  get isUserLoggedIn(): BehaviorSubject<boolean> {
    return this.authSubject;
  }

  get userName(): string {
    const token = localStorage.getItem('token');
    if (this.isTokenValid() && token) {
      const payload = this.decodeJwtPayload(token);
      return payload.name || '';
    }
    return '';
  }
  get isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (this.isTokenValid() && token) {
      const payload = this.decodeJwtPayload(token);
      return payload.isAdmin || false;
    }
    return false;
  }
  login(token: string, user: object): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authSubject.next(true);
    this.router.navigate(['/home']);
  }
  logout() {
    this.clearLocalStorage();
    this.authSubject.next(false);
    this.router.navigate(['/home']);
  }
  checkSessionValidity(): void {
    const token = localStorage.getItem('token');
    if (token && !this.isTokenValid()) {
      alert('Your session has expired. Please log in again.');
      this.logout();
    }
  }
}
