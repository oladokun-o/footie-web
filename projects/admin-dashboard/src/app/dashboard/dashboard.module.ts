import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminDashboardPagesModule } from './pages/pages.module';
import { AdminDashboardRoutingModule } from './dashboard-routing.module';
import { AdminDashboardLayoutModule } from './layout/layout.module';
import { AdminDashboardComponentsModule } from './components/dashboard-components.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UnauthorizedInterceptor } from '../core/interceptors/unauthorized.interceptor';

@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminDashboardPagesModule,
    AdminDashboardRoutingModule,
    AdminDashboardLayoutModule,
    AdminDashboardComponentsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    }
  ]
})
export class AdminDashboardModule { }
