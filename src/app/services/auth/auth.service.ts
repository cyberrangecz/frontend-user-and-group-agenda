import {Injectable} from '@angular/core';
import {authConfig} from '../../model/other/auth.config';
import {JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {User} from '../../model/user/user.model';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private oAuthService: OAuthService,
              private router: Router) {
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.logOut(true);
  }

  getLoginName() {
    const claims = this.oAuthService.getIdentityClaims();
    return !claims ? null : claims[name];
  }

  isAuthenticated(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  getAuthorizationToken(): string {
    return this.oAuthService.authorizationHeader();
  }
}
