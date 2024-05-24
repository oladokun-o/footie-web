import { Injectable } from '@angular/core';
import { Address } from '../interfaces/order.interface';
import { searchLocationsMockAPI } from 'src/app/utils/orders/order.mock';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  /**
   * Search for locations based on the search query
   * @param {string} query - The search query
   * @returns {Promise<Address[]>} - A list of locations
   */
  async searchLocations(query: string): Promise<Address[]> {
    const locations = await searchLocationsMockAPI(query);
    return locations;
  }
}
