import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KYCRecordsPagesModule } from './pages/pages.module';
import { KycRecordsRoutingModule } from './kyc-records-routing.module';
import { KycRecordsComponent } from './kyc-records.component';
import { AdminDashboardComponentsModule } from '../../components/dashboard-components.module';

@NgModule({
  declarations: [
    KycRecordsComponent
  ],
  imports: [
    CommonModule,
    KYCRecordsPagesModule,
    KycRecordsRoutingModule,
    AdminDashboardComponentsModule
  ]
})
export class KycRecordsModule { }
