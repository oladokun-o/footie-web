import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary/summary.component';
import { ManageComponent } from './manage/manage.component';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    SummaryComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatRippleModule
  ]
})
export class PagesModule { }
