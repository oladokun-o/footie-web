import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartKycComponent } from './start-kyc/start-kyc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from 'src/shared/components/components.module';
import { MatRippleModule } from '@angular/material/core';
import { ContinueKycComponent } from './continue-kyc/continue-kyc.component';
import { QRCodeModule } from 'angularx-qrcode';



@NgModule({
  declarations: [
    StartKycComponent,
    ContinueKycComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentsModule,
    MatRippleModule,
    QRCodeModule
  ]
})
export class KYCPagesModule { }
