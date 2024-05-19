import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from './loading-button/loading-button.component';
import { SwitchControlComponent } from './switch-control/switch-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { StarRatingComponent } from './star-rating/star-rating.component';



@NgModule({
  declarations: [
    LoadingButtonComponent,
    SwitchControlComponent,
    LoadingScreenComponent,
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingButtonComponent,
    SwitchControlComponent,
    LoadingScreenComponent,
    StarRatingComponent
  ]
})
export class SharedComponentsModule { }
