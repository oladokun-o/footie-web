import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycComponent } from './kyc.component';
import { KYCPagesModule } from './pages/pages.module';
import { KYCRoutingModule } from './kyc-routing.module';



@NgModule({
  declarations: [
    KycComponent
  ],
  imports: [
    CommonModule,
    KYCPagesModule,
    KYCRoutingModule
  ]
})
export class KycModule { }
