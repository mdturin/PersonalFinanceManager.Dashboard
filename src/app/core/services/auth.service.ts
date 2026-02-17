import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse } from '../models/auth-response.model';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private loader = inject(LoaderService);

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

  login(username: string, password: string) {
    this.loader.show();
    this.api
      .post<AuthResponse>(
        this.authEndpoint + '/login',
        {
          email: username,
          password: password,
        },
        { withCredentials: true },
      )
      .pipe(take(1))
      .subscribe({
        next: (response: AuthResponse) => {
          if (!response.success) {
            // TODO: show response message as Notification
            console.error(response.message);
          } else {
            console.info(response.message);
            localStorage.setItem(this.authStorageKey, response.token);
            this.isAuthenticatedSubject.next(true);
            this.router.navigateByUrl('/dashboard');
          }
        },
        error: console.error,
        complete: () => this.loader.hide(),
      });
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
