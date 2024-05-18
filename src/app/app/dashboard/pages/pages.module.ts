import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponentsModule } from '../components/components.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardComponentsModule
  ]
})
export class DashboardPagesModule { }
