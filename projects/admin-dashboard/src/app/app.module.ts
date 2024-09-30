import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { OnlineStatusModule } from 'ngx-online-status';
import { AdminAuthenticationModule } from './authentication/authentication.module';
import { SharedComponentsModule } from '../shared/components/components.module';
import { SharedDirectivesModule } from '../shared/directives/directives.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminDashboardModule } from './dashboard/dashboard.module';
import { HttpLoadingInterceptor } from './core/interceptors/http-loading.interceptor';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      closeButton: false,
      resetTimeoutOnDuplicate: true,
      enableHtml: true,
      positionClass: 'toast-top-center',
    }),
    NgxSkeletonLoaderModule.forRoot({
      animation: 'pulse',
      loadingText: 'Loading...',
      appearance: 'line',
    }),
    RouterModule,
    NgSelectModule,
    OnlineStatusModule,
    AdminAuthenticationModule,
    AdminDashboardModule,
    SharedComponentsModule,
    SharedDirectivesModule,
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
