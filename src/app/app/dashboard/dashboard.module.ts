import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { DashboardPagesModule } from './pages/pages.module';
import { DashboardComponentsModule } from './components/components.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    DashboardPagesModule,
    DashboardComponentsModule
  ]
})
export class DashboardModule { }
