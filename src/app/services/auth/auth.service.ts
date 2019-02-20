import {Injectable} from '@angular/core';
import {authConfig} from '../../model/other/auth.config';
import {JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {User} from '../../model/user/user.model';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private oAuthService: OAuthService) {
  }

  login() {
    this.oAuthService.loadDiscoveryDocumentAndLogin()
      .then(() => {
        // TODO: Inform components about the change
      });  }

  logout() {
    localStorage.clear();
    this.oAuthService.logOut(true);
  }

  isAuthenticated(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  getAuthorizationToken(): string {
    return this.oAuthService.authorizationHeader();
  }
}
