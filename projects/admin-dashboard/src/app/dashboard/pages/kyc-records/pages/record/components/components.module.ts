import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { KycInfoComponent } from './kyc-info/kyc-info.component';
import { DocumentsComponent } from './documents/documents.component';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    TabComponent,
    PersonalInfoComponent,
    KycInfoComponent,
    DocumentsComponent,
  ],
  imports: [
    CommonModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatRippleModule
  ],
  exports: [
    TabComponent,
    PersonalInfoComponent,
    KycInfoComponent,
    DocumentsComponent,
  ]
})
export class AdminKYCRecordComponentsModule { }
