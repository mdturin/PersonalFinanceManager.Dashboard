import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse } from '../models/auth-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authEndpoint = '/api/auth';
  private readonly authStorageKey = 'pfm.authentication.token';
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.readInitialAuthState()
  );

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  constructor(private api:ApiService, private router: Router){}

  login(username: string, password: string) {
    this.api.post<AuthResponse>(this.authEndpoint+"/login", {
      email: username,
      password: password
    }).pipe(take(1)).subscribe({
      next: (response: AuthResponse) => {
        if(!response.success){
          // TODO: show response message as Notification
          console.error(response.message);
        } else {
          console.info(response.message);
          localStorage.setItem(this.authStorageKey, response.token);
          this.isAuthenticatedSubject.next(true);
          this.router.navigateByUrl("/dashboard")
        }
      }
    })
  }

  logout(): void {
    localStorage.removeItem(this.authStorageKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigateByUrl("/");
  }

  getToken(): string {
    return localStorage.getItem(this.authStorageKey) ?? '';
  }

  private readInitialAuthState(): boolean {
    const token = localStorage.getItem(this.authStorageKey);
    if(token){
      return token !== '';
    }

    return false;
  }
}
