import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeriesComponent } from './series/series.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {Http401Interceptor} from './interceptors/http401.interceptor';
import {AuthHeadersInterceptorService} from './interceptors/auth-headers.interceptor';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SeriesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbDropdownModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Http401Interceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHeadersInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
