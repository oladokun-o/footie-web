import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from './loading-button/loading-button.component';
import { SwitchControlComponent } from './switch-control/switch-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoadingButtonComponent,
    SwitchControlComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingButtonComponent,
    SwitchControlComponent
  ]
})
export class SharedComponentsModule { }
