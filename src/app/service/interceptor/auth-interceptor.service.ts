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

/**
 * Service that intercepts HTTP requests to add authentication headers and handle authorization errors.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {
  }

  /**
   * Intercepts HTTP requests to add an authorization header if an access token is available.
   * Handles authorization errors (401 and 403) by logging out the user.
   *
   * @param request The outgoing HTTP request.
   * @param next The next handler in the HTTP request chain.
   */
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
