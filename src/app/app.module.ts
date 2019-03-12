import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoginGuard} from './services/guards/login-guard.service';
import {AuthGuard} from './services/guards/auth-guard.service';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AlertComponent } from './components/alert/alert.component';
import {AuthService} from './services/auth/auth.service';
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';
import {AuthHttpInterceptor} from './services/interceptors/auth-http-interceptor';
import {AppMaterialModule} from './app-material.module';
import { NotFoundComponent } from './components/not-found-component/not-found.component';
import {SharedModule} from './components/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    AlertComponent,
    NotFoundComponent
  ],
  imports: [
    AppRoutingModule,
    AppMaterialModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OAuthModule.forRoot(
      {
        resourceServer: {
        allowedUrls: [],
        sendAccessToken: true
      }
    })
  ],
  providers: [
    { provide: OAuthStorage, useValue: localStorage },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    AuthService,
    LoginGuard,
    AuthGuard
  ],
  entryComponents: [
    AlertComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
