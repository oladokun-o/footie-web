import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { YaGeocoderService, YaReadyEvent } from 'angular8-yandex-maps';

@Component({
  selector: 'footiedrop-web-select-location-on-map',
  templateUrl: './select-location-on-map.component.html',
  styleUrls: ['./select-location-on-map.component.scss']
})
export class SelectLocationOnMapComponent implements AfterViewInit, OnChanges {
  slideIn: boolean = true;
  @Input() slideOut: boolean = false;
  @Input() mapFor: 'pickup' | 'dropoff' = 'pickup';

  loadingMap: boolean = true;

  @Output() closeMap: EventEmitter<any> = new EventEmitter();


  constructor(private yaGeocoderService: YaGeocoderService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadingMap = false;
    }, 1500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["slideIn"] && changes["slideIn"].currentValue) {
      this.slideOut = false;
    };

    if (changes["slideOut"] && changes["slideOut"].currentValue) {
      this.slideIn = false;
    };
  }

  @ViewChild('map') map!: ElementRef<HTMLIFrameElement>;
  selectCurrentLocation() {

  }


  onMapReady(event: YaReadyEvent<ymaps.Map>): void {
    const map = event.target;
    /**
     * Comparing the position calculated from the user's IP address
     * and the position detected using the browser.
     */
    ymaps.geolocation
      .get({
        provider: 'yandex',
        mapStateAutoApply: true,
      })
      .then((result) => {
        // We'll mark the position calculated by IP in red.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({
          balloonContentBody: 'My location',
        });

        map.geoObjects.add(result.geoObjects);
      });

    ymaps.geolocation
      .get({
        provider: 'browser',
        mapStateAutoApply: true,
      })
      .then((result) => {
        /**
         * We'll mark the position obtained through the browser in blue.
         * If the browser does not support this functionality, the placemark will not be added to the map.
         */
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        map.geoObjects.add(result.geoObjects);
      });
  }
}
