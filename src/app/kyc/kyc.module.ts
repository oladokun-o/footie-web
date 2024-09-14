import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycComponent } from './kyc.component';
import { KYCPagesModule } from './pages/pages.module';
import { KYCRoutingModule } from './kyc-routing.module';
import { KYCModalsModule } from './modals/modals.module';



@NgModule({
  declarations: [
    KycComponent
  ],
  imports: [
    CommonModule,
    KYCPagesModule,
    KYCRoutingModule,
    KYCModalsModule
  ]
})
export class KycModule { }
