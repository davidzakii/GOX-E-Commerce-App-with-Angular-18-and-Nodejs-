import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private userNameSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router) {}

  registerUser(user: User): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.baseURL}/user/register`,
      user
    );
  }

  loginUser(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        `${environment.baseURL}/user/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((user: User) => {
          // Update client-side state after successful login
          this.authSubject.next(true);
          this.isAdminSubject.next(user.isAdmin || false);
          this.userNameSubject.next(user.name || '');
        })
      );
  }

  login(email: string, password: string): void {
    this.loginUser(email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid email or password.');
      },
    });
  }

  logout(): void {
    this.http
      .post(`${environment.baseURL}/user/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.clearClientState();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Logout failed:', err);
        },
      });
  }

  checkSessionValidity(): Observable<boolean> {
    return this.http
      .get<{ valid: boolean; user?: User }>(
        `${environment.baseURL}/user/validate-session`,
        { withCredentials: true }
      )
      .pipe(
        map((response) => {
          const isValid = response.valid && !!response.user;
          this.authSubject.next(isValid);
          if (isValid && response.user) {
            this.isAdminSubject.next(response.user.isAdmin || false);
            this.userNameSubject.next(response.user.name || '');
          } else {
            this.clearClientState();
          }
          return isValid;
        }),
        tap((isValid) => {
          // console.log('Session Validity:', isValid);
        }),
        catchError((err) => {
          // console.error('Session validation failed:', err.error);
          this.authSubject.next(false);
          return of(false);
        })
      );
  }

  private clearClientState(): void {
    this.authSubject.next(false);
    this.isAdminSubject.next(false);
    this.userNameSubject.next('');
  }

  userLoggedAsObservable(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  get isUserLoggedInValue(): boolean {
    return this.authSubject.value;
  }

  get isUserLoggedIn(): BehaviorSubject<boolean> {
    return this.authSubject;
  }

  userNameAsObservable(): Observable<string> {
    return this.userNameSubject.asObservable();
  }

  get userName(): BehaviorSubject<string> {
    return this.userNameSubject;
  }

  get userNameValue(): string {
    return this.userNameSubject.value;
  }

  isAdminAsObservable(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  get isAdmin(): BehaviorSubject<boolean> {
    return this.isAdminSubject;
  }

  get isAdminValue(): boolean {
    return this.isAdminSubject.value;
  }
}
