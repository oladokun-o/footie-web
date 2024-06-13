import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { DashboardPagesModule } from './pages/pages.module';
import { DashboardComponentsModule } from './components/components.module';
import { HomeModule } from './pages/home/home.module';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { ApiEndpoints } from '../core/configs/api.config';

const mapConfig: YaConfig = {
  apikey: ApiEndpoints.map.yandex_key,
  lang: 'en_US',
};

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    DashboardPagesModule,
    DashboardComponentsModule,
    HomeModule,
    AngularYandexMapsModule.forRoot(mapConfig),
  ],
})
export class DashboardModule {}
