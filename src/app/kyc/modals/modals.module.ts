import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KYCIsNeededComponent } from './kyc-is-needed/kyc-is-needed.component';



@NgModule({
  declarations: [
    KYCIsNeededComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KYCIsNeededComponent
  ]
})
export class KYCModalsModule { }
