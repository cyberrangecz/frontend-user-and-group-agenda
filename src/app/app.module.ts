import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SentinelLayout1Module } from '@sentinel/layout';
import { Kypo2AuthInterceptor, Kypo2AuthModule } from 'kypo2-auth';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

/**
 * Main module of the user and group-overview example app
 */
@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SentinelLayout1Module,
    HttpClientModule,
    AppRoutingModule,
    Kypo2AuthModule.forRoot(environment.kypo2AuthConfig),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Kypo2AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
