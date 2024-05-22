import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewOrderComponent } from './new-order/new-order.component';
import { HomeComponentsModule } from '../../home/components/components.module';

@NgModule({
  declarations: [
    CancelOrderComponent,
    NewOrderComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    HomeComponentsModule
  ]
})
export class ModalsModule { }
