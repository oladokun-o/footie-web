import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';



@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
