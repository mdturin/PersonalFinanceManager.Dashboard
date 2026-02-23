import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, take, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse } from '../models/auth-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private authEndpoint = '/api/auth';
  private readonly authStorageKey = 'pfm.authentication.token';
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.readInitialAuthState(),
  );

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(username: string, password: string): Observable<string | null> {
    return this.api
      .post<AuthResponse>(
        this.authEndpoint + '/login',
        {
          email: username,
          password,
        },
        { withCredentials: true },
      )
      .pipe(
        take(1),
        tap((response: AuthResponse) => {
          if (response.success) {
            localStorage.setItem(this.authStorageKey, response.token);
            this.isAuthenticatedSubject.next(true);
            this.router.navigateByUrl('/dashboard');
          }
        }),
        map((response: AuthResponse) =>
          response.success ? null : response.message || 'Login failed.',
        ),
      );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(this.authEndpoint + '/refresh-token', {}).pipe(
      tap((response) => {
        if (response.success) {
          localStorage.setItem(this.authStorageKey, response.token);
          this.isAuthenticatedSubject.next(true);
        } else {
          this.logout();
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.authStorageKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigateByUrl('/');
  }

  getToken(): string {
    return localStorage.getItem(this.authStorageKey) ?? '';
  }

  private readInitialAuthState(): boolean {
    const token = localStorage.getItem(this.authStorageKey);
    if (token) {
      return token !== '';
    }

    return false;
  }
}
