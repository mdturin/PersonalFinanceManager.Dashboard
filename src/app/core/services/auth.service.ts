import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authStorageKey = 'pfm.authenticated';
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.readInitialAuthState()
  );

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(username: string, password: string): boolean {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    this.updateAuthState(true);
    return true;
  }

  logout(): void {
    this.updateAuthState(false);
  }

  private readInitialAuthState(): boolean {
    return localStorage.getItem(this.authStorageKey) === 'true';
  }

  private updateAuthState(isAuthenticated: boolean): void {
    localStorage.setItem(this.authStorageKey, String(isAuthenticated));
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}
