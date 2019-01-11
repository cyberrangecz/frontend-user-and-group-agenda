import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoginGuard} from './services/guards/login-guard.service';
import {AuthGuard} from './services/guards/auth-guard.service';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import {MatTabsModule} from '@angular/material';
import { AlertComponent } from './components/alert/alert.component';
import {AlertService} from './services/alert.service';
import {AuthService} from './services/auth.service';
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';
import {authConfig} from './model/other/auth.config';

@NgModule({
  declarations: [
    AppComponent,
    NotAuthorizedComponent,
    NotFoundComponent,
    LandingPageComponent,
    AlertComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OAuthModule.forRoot(
      {
        resourceServer: {
        allowedUrls: [],
        sendAccessToken: true
      }
    }),
    MatTabsModule
  ],
  providers: [
    { provide: OAuthStorage, useValue: localStorage },
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AlertService,
    AuthService,
    LoginGuard,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
