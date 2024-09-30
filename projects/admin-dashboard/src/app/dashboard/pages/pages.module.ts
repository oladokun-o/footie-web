import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponentsModule } from '../components/dashboard-components.module';
import { AdminDashboardLayoutModule } from '../layout/layout.module';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KycRecordsModule } from './kyc-records/kyc-records.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


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
    NgbDropdownModule
  ]
})
export class AdminPagesModule { }
