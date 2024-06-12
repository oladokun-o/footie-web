import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { YaEvent } from 'angular8-yandex-maps';
import { debounceTime } from 'rxjs';
import { GeoObjectConstructor, UserLocation } from 'src/app/core/interfaces/location.interface';
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
  @Input() address!: Address;

  loadingMap: boolean = true;

  @Output() closeMap: EventEmitter<any> = new EventEmitter();

  @Output() setMapLocationToAddress: EventEmitter<Address> = new EventEmitter();

  @ViewChild('map') map!: ElementRef<HTMLIFrameElement>;

  constructor(
    private locationService: LocationService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadingMap = false;
      this.showButtonPickup = true;

      if (this.address) {
        this.mapsControl = [];
        this.mapState = {
          center: this.address.coordinates || [0, 0],
          controls: this.mapsControl
        };

        this.geoObject = {
          feature: {
            // The geometry description.
            geometry: {
              type: 'Point',
              coordinates: this.address.coordinates || [0, 0],
            },
            // Properties.
            properties: {
              // The placemark content.
              hintContent: "I'm draggable",
            },
          },
          options: {
            /**
             * Options.
             * The placemark's icon will stretch to fit its contents.
             */
            preset: 'islands#blackStretchyIcon',
            // The placemark can be dragged.
            draggable: true,
          },
        };
      }
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["slideIn"] && changes["slideIn"].currentValue) {
      this.slideOut = false;
    };

    if (changes["slideOut"] && changes["slideOut"].currentValue) {
      this.slideIn = false;
    };
  }

  selectCurrentLocation() { }

  showButtonPickup: boolean = false;

  handleCloseMap() {
    this.closeMap.emit();
    if (this.map) this.map.nativeElement.remove();
  }

  handleMapChange() {
    this.setMapLocationToAddress.emit(this.address);
    this.handleCloseMap();
  }

  mapsControl: ymaps.ControlKey[] = []

  mapState!: ymaps.IMapState;

  locatorButtonParameters: ymaps.control.IButtonParameters = {
    data: {
      image: 'assets/images/icons/my-location.svg'
    },
    options: {
      position: {
        bottom: 195,
        right: 15
      },
      size: 'large',
    },
  };

  searchButtonParameters: ymaps.control.ISearchControlParameters = {
    options: {
      position: {
        top: 25,
        right: 15,
      },
    },
  };

  geoObject!: GeoObjectConstructor;
  searchingLocation: boolean = false;

  handleGeometryChange(event: any): void {
    const { originalEvent } = event.event.originalEvent.originalEvent;

    if (originalEvent) {
      this.searchingLocation = true;
      setTimeout(() => {
        this.locationService.searchLocation(originalEvent.newCoordinates).pipe(
          debounceTime(1000) // Add debounce time to limit the number of API calls
        ).subscribe(
          (location) => {
            this.searchingLocation = false;
            if (location) this.address = location;
          },
          (error) => {
            this.searchingLocation = false; // Reset searchingLocation on error
            console.error('Error searching for location:', error);
          }
        );
      }, 1000);
    }
  }

  enableSearchControl: boolean = false;

  toggleSearch() {
    if (!this.enableSearchControl) {
      this.enableSearchControl = true;
    } else {
      this.enableSearchControl = false;
    }
  }
}
