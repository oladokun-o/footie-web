import { Injectable } from '@angular/core';
import { Address } from '../interfaces/order.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { YaGeocoderService, YaReadyEvent } from 'angular8-yandex-maps';
import { UserLocation } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private userCurrentLocation: Address = JSON.parse(
    localStorage.getItem('userCurrentLocation') as string
  );

  constructor(private yaGeocoderService: YaGeocoderService) {}

  /**
   * Search for locations based on the search query
   * @param {string} query - The search query
   * @param {string} type - The location type ('pickup' or 'delivery')
   * @param {number[][]} boundedBy - The bounding box for search results
   * @param {boolean} strictBounds - Whether to enforce strict bounds for search results
   * @returns {Observable<Address[]>} - A list of locations
   */
  searchLocations(
    query: string,
    type: 'pickup' | 'delivery',
    boundedBy?: number[][],
    strictBounds?: boolean
  ): Observable<Address[]> {
    return this.yaGeocoderService
      .geocode(query, {
        boundedBy: boundedBy,
        strictBounds: strictBounds,
      })
      .pipe(
        map((result: any) => {
          const geoObjects = result.geoObjects.toArray();
          return geoObjects.map((geoObject: any) => {
            const properties: UserLocation = geoObject.properties.getAll();
            const metaData =
              properties.metaDataProperty.GeocoderMetaData.AddressDetails
                .Country;
            const location: Address = {
              address: metaData.AddressLine,
              city:
                metaData.Locality?.DependentLocality?.DependentLocalityName ||
                metaData.Locality?.LocalityName ||
                metaData?.AdministrativeArea?.AdministrativeAreaName ||
                '',
              state:
                metaData.Locality?.LocalityName ||
                metaData.Locality?.DependentLocality?.DependentLocalityName ||
                metaData?.AdministrativeArea?.AdministrativeAreaName ||
                '',
              postalCode: '',
              country: metaData.CountryNameCode,
              locationType: properties.metaDataProperty.GeocoderMetaData.kind,
              type: type,
              coordinates: geoObject.geometry.getCoordinates(),
            };
            return location;
          });
        }),
        catchError((error) => {
          console.error(
            'An error occurred while searching for locations',
            error
          );
          return [];
        })
      );
  }

  /**
   * Search for a single location based on the search query
   * @param {string} query - The search query
   * @param {string} type - The location type ('pickup' or 'delivery')
   * @param {number[][]} boundedBy - The bounding box for search results
   * @param {boolean} strictBounds - Whether to enforce strict bounds for search results
   * @returns {Observable<Address>} - A single location
   */
  searchLocation(
    query: string,
    boundedBy?: number[][],
    strictBounds?: boolean
  ): Observable<Address> {
    return this.searchLocations(query, 'pickup', boundedBy, strictBounds).pipe(
      map((locations: Address[]) => {
        if (locations.length > 0) {
          return locations[0];
        } else {
          throw new Error('No locations found');
        }
      }),
      catchError((error) => {
        console.error(
          'An error occurred while searching for a location',
          error
        );
        return throwError(error);
      })
    );
  }

  get userCoordinates(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      if (this.userCurrentLocation.coordinates) {
        resolve(this.userCurrentLocation.coordinates);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              resolve([position.coords.latitude, position.coords.longitude]);
            }
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  getAlternativeUserCoordinates(
    event: YaReadyEvent<ymaps.Map>
  ): Promise<number[]> {
    return new Promise((resolve, reject) => {
      ymaps.geolocation
        .get({
          provider: 'yandex',
          mapStateAutoApply: true,
        })
        .then((result: any) => {
          resolve(result.geoObjects.position as number[]);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }
}
