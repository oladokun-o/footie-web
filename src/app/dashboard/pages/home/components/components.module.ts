import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOrderComponent } from './select-order/select-order.component';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { RecentDeliveriesComponent } from './recent-deliveries/recent-deliveries.component';
import { CurrentDeliveriesComponent } from './current-deliveries/current-deliveries.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    SelectOrderComponent,
    RecentDeliveriesComponent,
    CurrentDeliveriesComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    RouterModule,
    MatDialogModule
  ],
  exports: [
    SelectOrderComponent,
    RecentDeliveriesComponent,
    CurrentDeliveriesComponent
  ]
})
export class HomeComponentsModule { }
