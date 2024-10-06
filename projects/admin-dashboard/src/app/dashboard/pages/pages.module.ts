import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponentsModule } from '../components/dashboard-components.module';
import { AdminDashboardLayoutModule } from '../layout/layout.module';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from 'projects/admin-dashboard/src/shared/components/components.module';


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    AdminDashboardComponentsModule,
    AdminDashboardLayoutModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    NgbDropdownModule,
    SharedComponentsModule
  ]
})
export class AdminDashboardPagesModule { }
