import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CancelOrderComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ModalsModule { }
