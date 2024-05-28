import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { YaGeocoderService, YaMapComponent, YaReadyEvent,  } from 'angular8-yandex-maps';
import { Address } from 'src/app/core/interfaces/order.interface';
import { LocationService } from 'src/app/core/services/location.service';

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

  userCurrentLocation: Address = JSON.parse(localStorage.getItem('userCurrentLocation') as string);
  @Input() selectedTypeAddress!: Address;

  constructor(
    private yaGeocoderService: YaGeocoderService,
    private locationService: LocationService
  ) {
    this.locationService.userCoordinates
      .then((coordinates) => {
        this.userCurrentLocation.coordinates = coordinates;
      })
      .catch((error) => {
        console.error('Error fetching user coordinates:', error);
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadingMap = false;
    }, 1500);

    console.log('Map loaded', this.Map.yacontextmenu.forEach(item => item ));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["slideIn"] && changes["slideIn"].currentValue) {
      this.slideOut = false;
    };

    if (changes["slideOut"] && changes["slideOut"].currentValue) {
      this.slideIn = false;
    };
  }

  selectCurrentLocation(event: any): void {
    console.log("selectCurrentLocation', event: " + event);
  }

  get userCoordinates(): number[] {
    return this.userCurrentLocation.coordinates || [0,0];
  }

  get mapState(): any {
    let state = {
      center: this.selectedTypeAddress.coordinates || this.userCoordinates,
      controls: ['geolocationControl']
    };
    console.log("get mapState", state);
    return state;
  }

  @ViewChild('map') Map!: YaMapComponent;

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
