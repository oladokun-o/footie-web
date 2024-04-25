import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HttpLoadingInterceptor } from './core/interceptors/http-loading.interceptor';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import { NgSelectModule } from '@ng-select/ng-select';
import { OnlineStatusModule } from 'ngx-online-status';
import { AuthModule } from './app/auth/auth.module';
import { SharedComponentsModule } from 'src/shared/components/components.module';
import { SharedDirectivesModule } from 'src/shared/directives/directives.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    RouterModule,
    NgSelectModule,
    OnlineStatusModule,
    AuthModule,
    SharedComponentsModule,
    SharedDirectivesModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
