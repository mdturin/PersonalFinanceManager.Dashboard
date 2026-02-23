import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private baseUrl = environment.apiBaseUrl;

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  get<T>(endpoint: string, options?: { params?: HttpParams }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.get<T>(url, options).pipe(catchError((error) => this.handleError(error)));
  }

  post<T>(endpoint: string, data: unknown, options?: { withCredentials?: boolean }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http
      .post<T>(url, data, {
        withCredentials: options?.withCredentials ?? false,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  put<T>(endpoint: string, data: unknown): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<T>(url, data).pipe(catchError((error) => this.handleError(error)));
  }

  patch<T>(endpoint: string, data: unknown): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.patch<T>(url, data).pipe(catchError((error) => this.handleError(error)));
  }

  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<T>(url).pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = this.getErrorMessage(error);
    this.notificationService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    if (error.error instanceof ErrorEvent) {
      return error.error.message;
    }

    if (error.status === 0) {
      return 'Unable to reach server. Please check your connection and try again.';
    }

    return error.message || 'An unexpected error occurred. Please try again.';
  }
}
