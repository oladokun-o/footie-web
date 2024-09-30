import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KYCRecordsPagesModule } from './pages/pages.module';
import { KycRecordsRoutingModule } from './kyc-records-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    KYCRecordsPagesModule,
    KycRecordsRoutingModule
  ]
})
export class KycRecordsModule { }
