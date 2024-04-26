import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { InputMaskDirective } from './input-mask.directive';



@NgModule({
  declarations: [
    NumbersOnlyDirective,
    InputMaskDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumbersOnlyDirective,
    InputMaskDirective
  ]
})
export class SharedDirectivesModule { }
