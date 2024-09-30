import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminPagesModule } from './pages/pages.module';
import { AdminDashboardRoutingModule } from './dashboard-routing.module';
import { AdminDashboardLayoutModule } from './layout/layout.module';
import { AdminDashboardComponentsModule } from './components/dashboard-components.module';

@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminPagesModule,
    AdminDashboardRoutingModule,
    AdminDashboardLayoutModule,
    AdminDashboardComponentsModule
  ]
})
export class AdminDashboardModule { }
