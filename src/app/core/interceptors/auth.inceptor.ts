import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

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
        if (error.status !== 401) {
          return throwError(() => error);
        }

        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshTokenSubject.next(null);

          return this.authService.refreshToken().pipe(
            switchMap((response) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(response.token);
              return next.handle(this.addToken(req, response.token));
            }),
            catchError((err) => {
              this.isRefreshing = false;
              this.authService.logout();
              return throwError(() => err);
            }),
          );
        }

        // 👇 WAIT until refresh finishes
        return this.refreshTokenSubject.pipe(
          filter((token) => token != null),
          take(1),
          switchMap((token) => next.handle(this.addToken(req, token!))),
        );
      }),
    );
  }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  }
}
