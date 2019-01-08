import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {UserFacadeService} from './services/user/user-facade.service';
import {GroupFacadeService} from './services/group/group-facade.service';
import {LoginGuard} from './services/guards/login-guard.service';
import {AuthGuard} from './services/guards/auth-guard.service';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import {MatTabsModule} from '@angular/material';
import { AlertComponent } from './components/alert/alert.component';
import {AlertService} from './services/alert.service';

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
    MatTabsModule
  ],
  providers: [
    UserFacadeService,
    GroupFacadeService,
    AlertService,
    LoginGuard,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
