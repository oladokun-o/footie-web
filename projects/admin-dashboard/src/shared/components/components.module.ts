import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from './loading-button/loading-button.component';
import { SwitchControlComponent } from './switch-control/switch-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { KycListComponent } from './kyc-list/kyc-list.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InfoCardComponent } from './info-card/info-card.component';



@NgModule({
  declarations: [
    LoadingButtonComponent,
    SwitchControlComponent,
    LoadingScreenComponent,
    StarRatingComponent,
    KycListComponent,
    InfoCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    RouterModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTooltipModule
  ],
  exports: [
    LoadingButtonComponent,
    SwitchControlComponent,
    LoadingScreenComponent,
    StarRatingComponent,
    KycListComponent,
    InfoCardComponent,
  ]
})
export class SharedComponentsModule { }
