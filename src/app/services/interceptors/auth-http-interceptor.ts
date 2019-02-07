import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  /**
   * Intercepts HTTP requests and adds authorization token
   * @param req http request
   * @param next next http handler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated() && req.url.startsWith(environment.userAndGroupRestBasePath)) {
      const clonedReq = req.clone({
        headers: req.headers.append('Authorization', this.authService.getAuthorizationToken())
      });
      return next.handle(clonedReq)
        .pipe(tap((event: HttpEvent<any>) => {},
          err => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                window.confirm('You cannot access this resource. You will be navigated to the login page.');
                this.router.navigate(['login']);
              }
            }
          }));
    }
    return next.handle(req);
  }

}

