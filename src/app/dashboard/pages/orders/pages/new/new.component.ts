import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Address } from 'src/app/core/interfaces/order.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { mockData } from 'src/app/utils/orders/order.mock';
import * as Chance from 'chance';
import { OrdersService } from 'src/app/core/services/orders.service';
const chance = new Chance();

@Component({
  selector: 'footiedrop-web-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent {
  type: 'instant' | 'scheduled' = 'instant';
  user: User = mockData.user; // JSON.parse(localStorage.getItem('user') as string);
  recentDeliveriesLocation: Address[] = [];
  newOrderStages: 'location' | 'details' | 'confirmation' = 'location';
  newOrderForm!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrdersService,
  ) {
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
          address: new FormControl(chance.address(), [Validators.required]),
          city: new FormControl(chance.city(), [Validators.required]),
          state: new FormControl(chance.state(), [Validators.required]),
          postalCode: new FormControl(chance.zip(), [Validators.required]),
          country: new FormControl('Russia', [Validators.required]),
        }),
        delivery: new FormGroup({
          address: new FormControl(chance.address(), [Validators.required]),
          city: new FormControl(chance.city(), [Validators.required]),
          state: new FormControl(chance.state(), [Validators.required]),
          postalCode: new FormControl(chance.zip(), [Validators.required]),
          country: new FormControl('Russia', [Validators.required]),
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
    return this.newOrderForm.get('location.pickup.address')?.value;
  }

  get deliveryAddress(): string {
    return this.newOrderForm.get('location.delivery.address')?.value;
  }

  clearAddress(type: 'pickup' | 'delivery'): void {
    if (type === 'pickup') {
      this.newOrderForm.get('location.pickup')?.reset();
    } else {
      this.newOrderForm.get('location.delivery')?.reset();
    }
  }

  searchingPickup: boolean = false;
  searchingDelivery: boolean = false;

  searchAddress(type: 'pickup' | 'delivery'): void {
    // Search address
    if (type === 'pickup') {
      let searchvalue = this.newOrderForm.get('location.pickup.address')?.value;
      if (searchvalue && searchvalue.length > 3) {
        this.searchingPickup = true;
        setTimeout(() => {
          this.searchingPickup = false;
        }, 2000);
      }
    } else {
      let searchvalue = this.newOrderForm.get('location.delivery.address')?.value;
      if (searchvalue && searchvalue.length > 3) {
        this.searchingDelivery = true;
        setTimeout(() => {
          this.searchingDelivery = false;
        }, 2000);
      }
    }
  }

}
