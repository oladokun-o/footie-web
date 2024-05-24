import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Address } from 'src/app/core/interfaces/order.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { mockData } from 'src/app/utils/orders/order.mock';
import * as Chance from 'chance';
import { OrdersService } from 'src/app/core/services/orders.service';
import { OrdersHelpers } from 'src/app/utils/orders/helpers';
import { LocationService } from 'src/app/core/services/location.service';
const chance = new Chance();

@Component({
  selector: 'footiedrop-web-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent extends OrdersHelpers {
  type: 'instant' | 'scheduled' = 'instant';
  user: User = mockData.user; // JSON.parse(localStorage.getItem('user') as string);
  recentDeliveriesLocation: Address[] = [];
  newOrderStages: 'location' | 'details' | 'confirmation' = 'location';
  newOrderForm!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrdersService,
    private locationService: LocationService,
  ) {
    super();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params["type"]) {
        this.type = params["type"];
      }

      this.initForm();
    });

    if (this.user) {
      this.initUserDetails();
    };
  }

  initUserDetails(): void {
    this.recentDeliveriesLocation = this.user.orders?.filter(order => order.status === 'Delivered').map(order => order.deliveryAddress) || [];
  }

  initForm(): void {
    this.newOrderForm = new FormGroup({
      location: new FormGroup({
        pickup: new FormGroup({
          address: new FormControl(null, [Validators.required]),
          city: new FormControl(null, [Validators.required]),
          state: new FormControl(null, [Validators.required]),
          postalCode: new FormControl(null, [Validators.required]),
          country: new FormControl('Russia', [Validators.required]),
          locationType: new FormControl(null, [Validators.required]),
        }),
        delivery: new FormGroup({
          address: new FormControl(null, [Validators.required]),
          city: new FormControl(null, [Validators.required]),
          state: new FormControl(null, [Validators.required]),
          postalCode: new FormControl(null, [Validators.required]),
          country: new FormControl('Russia', [Validators.required]),
          locationType: new FormControl(null, [Validators.required]),
        }),
      }),
      details: new FormGroup({}),
    });

    if (this.type === "scheduled") {
      this.newOrderForm.addControl('schedule', new FormGroup({
        date: new FormControl('', [Validators.required]),
        time: new FormControl('', [Validators.required]),
      }));
    }
  }

  get pickupAddress(): string {
    return this.newOrderForm.get('location.pickup.address')?.value || '';
  }

  get deliveryAddress(): string {
    return this.newOrderForm.get('location.delivery.address')?.value || '';
  }

  clearAddress(type: 'pickup' | 'delivery'): void {
    if (type === 'pickup') {
      this.newOrderForm.get('location.pickup')?.reset();
    } else {
      this.newOrderForm.get('location.delivery')?.reset();
    }
  }

  searchingPickup: boolean = false;
  searchedForPickupAddress: boolean = false;
  searchingDelivery: boolean = false;
  searchedForDeliveryAddress: boolean = false;

  foundLocations: Address[] = [];

  searchAddress(type: 'pickup' | 'delivery'): void {
    // Search address
    if (type === 'pickup') {
      let searchvalue = this.newOrderForm.get('location.pickup.address')?.value;
      if (!searchvalue) {
        this.foundLocations = [];
        return;
      };
      if (searchvalue && searchvalue.length) {
        this.searchingPickup = true;
        this.searchedForPickupAddress = true;
        this.searchedForDeliveryAddress = false;
        this.locationService.searchLocations(searchvalue).then((locations) => {
          this.searchingPickup = false;
          this.foundLocations = locations;
        });
      }
    } else {
      let searchvalue = this.newOrderForm.get('location.delivery.address')?.value;
      if (!searchvalue) {
        this.foundLocations = [];
        return;
      };
      if (searchvalue && searchvalue.length) {
        this.searchingDelivery = true;
        this.searchedForDeliveryAddress = true;
        this.searchedForPickupAddress = false;
        this.locationService.searchLocations(searchvalue).then((locations) => {
          this.searchingDelivery = false;
          this.foundLocations = locations;
        });
      }
    }
  }

  selectAddress(address: Address): void {
    if (this.pickupAddress === '') {
      this.newOrderForm.get('location.pickup.address')?.patchValue(address.street);
      this.newOrderForm.get('location.pickup')?.patchValue(address);
    } else if (this.deliveryAddress === '') {
      this.newOrderForm.get('location.delivery.address')?.patchValue(address.street);
      this.newOrderForm.get('location.delivery')?.patchValue(address);
    } else if (this.pickupAddress !== '' && this.searchedForPickupAddress) {
      this.newOrderForm.get('location.pickup.address')?.patchValue(address.street);
      this.newOrderForm.get('location.pickup')?.patchValue(address);
    } else if (this.deliveryAddress !== '' && this.searchedForDeliveryAddress) {
      this.newOrderForm.get('location.delivery.address')?.patchValue(address.street);
      this.newOrderForm.get('location.delivery')?.patchValue(address);
    } else {
      this.newOrderForm.get('location.pickup.address')?.patchValue(address.street);
      this.newOrderForm.get('location.pickup')?.patchValue(address);
    }

    this.foundLocations = [];

    console.log(this.newOrderForm.value, address);
  }
}
