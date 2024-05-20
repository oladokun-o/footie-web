import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary/summary.component';
import { ManageComponent } from './manage/manage.component';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedComponentsModule } from 'src/shared/components/components.module';
import { MatBadgeModule } from '@angular/material/badge';
import { NewComponent } from './new/new.component';


@NgModule({
  declarations: [
    SummaryComponent,
    ManageComponent,
    NewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatRippleModule,
    MatDialogModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class PagesModule { }
