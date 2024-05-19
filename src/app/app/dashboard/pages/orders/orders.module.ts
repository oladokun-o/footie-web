import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { PagesModule } from './pages/pages.module';



@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    OrdersRoutingModule,
    PagesModule
  ]
})
export class OrdersModule { }
