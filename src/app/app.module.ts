import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';
import {AuthHttpInterceptor} from './auth-http-interceptor';
import {CustomConfig} from './custom-config';
import {UserAndGroupManagementModule} from '../../projects/user-and-group-management/src/public_api';
import {AuthService} from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    UserAndGroupManagementModule.forRoot(CustomConfig),
    OAuthModule.forRoot(
      {
        resourceServer: {
        allowedUrls: [],
        sendAccessToken: true
      }
    })
  ],
  providers: [
    AuthService,
    { provide: OAuthStorage, useValue: localStorage },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
