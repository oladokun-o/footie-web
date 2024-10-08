import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RecordComponent } from './record/record.component';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AdminDashboardComponentsModule } from '../../../components/dashboard-components.module';
import { SharedComponentsModule } from 'projects/admin-dashboard/src/shared/components/components.module';
import { ClipboardModule } from 'ngx-clipboard';
import { AdminKYCRecordComponentsModule } from './record/components/components.module';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    ListComponent,
    RecordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    NgbDropdownModule,
    AdminDashboardComponentsModule,
    SharedComponentsModule,
    ClipboardModule,
    NgbTooltip,
    AdminKYCRecordComponentsModule,
    MatRippleModule
  ]
})
export class KYCRecordsPagesModule { }
