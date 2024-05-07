import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (typeof localStorage !== 'undefined') {
      const localData = localStorage.getItem('access_token')
      if (localData !== null) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${localData}`
          }
        });
      }
    }

    return next.handle(request)
      .pipe(
        tap({
          error: error => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 401 || error.status === 403) {
                this.authService.logout()
              }
            }
          }
        }));
  }
}
