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
import { AuthModule } from './auth/auth.module';
import { SharedComponentsModule } from 'src/shared/components/components.module';
import { SharedDirectivesModule } from 'src/shared/directives/directives.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';

const mapConfig: YaConfig = {
  apikey: '2215fdbd-83bb-4c46-9c52-faffd29f5d91',
  lang: 'en_US',
};

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      closeButton: false,
      resetTimeoutOnDuplicate: true,
      enableHtml: true,
      positionClass: 'toast-top-center',
    }),
    RouterModule,
    NgSelectModule,
    OnlineStatusModule,
    AuthModule,
    DashboardModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    AngularYandexMapsModule.forRoot(mapConfig),
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
