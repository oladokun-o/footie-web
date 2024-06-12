import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectLocationOnMapComponent } from './select-location-on-map/select-location-on-map.component';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { ApiEndpoints } from 'src/app/core/configs/api.config';

const mapConfig: YaConfig = {
  apikey: ApiEndpoints.map.yandex_key,
  lang: 'en_US',
};

@NgModule({
  declarations: [
    SelectLocationOnMapComponent
  ],
  imports: [
    CommonModule,
    AngularYandexMapsModule.forRoot(mapConfig),
  ],
  exports: [
    SelectLocationOnMapComponent
  ]
})
export class OrdersComponentsModule { }
