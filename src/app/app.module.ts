import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClient} from '@angular/common/http';
import {UserFacadeService} from './services/user/user-facade.service';
import {GroupFacadeService} from './services/group/group-facade.service';
import {LoginGuard} from './services/guards/login-guard.service';
import {AuthGuard} from './services/guards/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    HttpClient,
    NotAuthorizedComponent,
    NotFoundComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    UserFacadeService,
    GroupFacadeService,
    LoginGuard,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
