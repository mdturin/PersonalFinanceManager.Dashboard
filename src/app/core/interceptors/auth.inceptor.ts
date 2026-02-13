import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = inject(AuthService);
        const token = authService.getToken();

        if (!token) {
            return next.handle(req);
        }

        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next.handle(authReq);
    }
}