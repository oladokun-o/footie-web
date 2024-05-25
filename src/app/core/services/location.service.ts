import { Injectable } from '@angular/core';
import { Address } from '../interfaces/order.interface';
import { searchLocationsMockAPI } from 'src/app/utils/orders/order.mock';
import { catchError, map, Observable } from 'rxjs';
import { YaGeocoderService } from 'angular8-yandex-maps';
import { UserLocation } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private yaGeocoderService: YaGeocoderService
  ) { }

  /**
   * Search for locations based on the search query
   * @param {string} query - The search query
   * @returns {Promise<Address[]>} - A list of locations
   */
  searchLocations(query: string, type: 'pickup' | 'delivery'): Observable<Address[]> {
    return this.yaGeocoderService.geocode(query).pipe(
      map((result: any) => {
        const geoObjects = result.geoObjects.toArray();
        return geoObjects.map((geoObject: any) => {
          const properties: UserLocation = geoObject.properties.getAll();
          const metaData = properties.metaDataProperty.GeocoderMetaData.AddressDetails.Country;

          return {
            street: metaData.AddressLine,
            city: metaData.Locality?.DependentLocality?.DependentLocalityName || metaData.Locality?.LocalityName || metaData?.AdministrativeArea?.AdministrativeAreaName || '',
            state: metaData.Locality?.LocalityName || metaData.Locality?.DependentLocality?.DependentLocalityName || metaData?.AdministrativeArea?.AdministrativeAreaName || '',
            postalCode: '',
            country: metaData.CountryNameCode,
            locationType: properties.metaDataProperty.GeocoderMetaData.kind,
            type: type
          };
        });
      }),
      catchError((error) => {
        console.error('An error occurred while searching for locations', error);
        return [];
      })
    )
  }
}
