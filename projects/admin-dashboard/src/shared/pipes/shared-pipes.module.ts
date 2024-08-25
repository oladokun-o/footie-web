import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressTypeFilterPipe } from './location.pipe';



@NgModule({
  declarations: [
    AddressTypeFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AddressTypeFilterPipe
  ]
})
export class SharedPipesModule { }
