import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RecordComponent } from './record/record.component';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminDashboardComponentsModule } from '../../../components/dashboard-components.module';
import { SharedComponentsModule } from 'projects/admin-dashboard/src/shared/components/components.module';



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
    SharedComponentsModule
  ]
})
export class KYCRecordsPagesModule { }
