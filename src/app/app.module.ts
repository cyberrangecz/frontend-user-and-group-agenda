import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SentinelLayout1Module } from '@sentinel/layout/layout1';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SentinelAuthModule } from '@sentinel/auth';
import { SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard } from '@sentinel/auth/guards';

/**
 * Main module of the user and group-overview example app
 */
@NgModule({
    declarations: [AppComponent, HomeComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SentinelLayout1Module,
        AppRoutingModule,
        SentinelAuthModule.forRoot(environment.authConfig)
    ],
    providers: [
        SentinelAuthGuardWithLogin,
        SentinelNegativeAuthGuard,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule {
}
