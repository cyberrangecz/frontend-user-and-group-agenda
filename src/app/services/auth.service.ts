import {Injectable} from '@angular/core';
import {authConfig} from '../model/other/auth.config';
import {JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';

@Injectable()
export class AuthService {

  constructor(private oAuthService: OAuthService) {
  }

  configure() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.logOut();
  }

  getLoginName() {
    const claims = this.oAuthService.getIdentityClaims();
    return !claims ? null : claims[name];
  }
}
