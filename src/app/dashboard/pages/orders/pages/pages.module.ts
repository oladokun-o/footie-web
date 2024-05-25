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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { SharedPipesModule } from 'src/shared/pipes/shared-pipes.module';
import { OrdersComponentsModule } from '../components/components.module';
import { YaConfig, AngularYandexMapsModule } from 'angular8-yandex-maps';

const mapConfig: YaConfig = {
  apikey: '2215fdbd-83bb-4c46-9c52-faffd29f5d91',
  lang: 'en_US',
};

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
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    SharedPipesModule,
    OrdersComponentsModule,
    AngularYandexMapsModule.forRoot(mapConfig),
  ]
})
export class PagesModule { }
