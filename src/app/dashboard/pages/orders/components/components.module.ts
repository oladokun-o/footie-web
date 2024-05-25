import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectLocationOnMapComponent } from './select-location-on-map/select-location-on-map.component';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';

const mapConfig: YaConfig = {
  apikey: '2215fdbd-83bb-4c46-9c52-faffd29f5d91',
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
