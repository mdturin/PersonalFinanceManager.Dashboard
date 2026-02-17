import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService);
    const token = authService.getToken();

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return authService.refreshToken().pipe(
            switchMap(() => {
              this.isRefreshing = false;
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${authService.getToken()}`,
                },
                withCredentials: true,
              });

              return next.handle(newReq);
            }),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
