import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {OAuthService} from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private oAuthService: OAuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.oAuthService.hasValidIdToken() && this.oAuthService.hasValidAccessToken()) {
      return Promise.resolve(true);
    }
    return this.oAuthService.loadDiscoveryDocumentAndLogin()
      .then(() => {
        return this.oAuthService.hasValidIdToken() && this.oAuthService.hasValidAccessToken();
      })
      .then(valid => {
        return valid;
      });
  }

}
