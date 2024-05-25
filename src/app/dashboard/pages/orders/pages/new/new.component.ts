import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Address } from 'src/app/core/interfaces/order.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { mockData, mockLocation } from 'src/app/utils/orders/order.mock';
import * as Chance from 'chance';
import { OrdersService } from 'src/app/core/services/orders.service';
import { OrdersHelpers } from 'src/app/utils/orders/helpers';
import { LocationService } from 'src/app/core/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { YaGeocoderService } from 'angular8-yandex-maps';
import { Subscription, switchMap, tap } from 'rxjs';
import { UserLocation } from 'src/app/core/interfaces/location.interface';
const chance = new Chance();

interface Stage {
  value: 'location' | 'details' | 'confirmation', label: string, visited: boolean
}

@Component({
  selector: 'footiedrop-web-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent extends OrdersHelpers implements OnInit {
  type: 'instant' | 'scheduled' = 'instant';
  user: User = mockData.user; // JSON.parse(localStorage.getItem('user') as string);
  recentDeliveriesLocation: Address[] = [];
  newOrderStages: Stage[] = [
    { value: 'location', label: 'Delivery route', visited: true },
    { value: 'details', label: 'Details', visited: false },
    { value: 'confirmation', label: 'Confirm order', visited: false }
  ];
  newOrderStage = this.newOrderStages[0];
  newOrderForm!: FormGroup;
  userCurrentLocation: Address = JSON.parse(localStorage.getItem('userCurrentLocation') as string);

  @ViewChild('pickup') pickupAddressInput: ElementRef<HTMLInputElement> | undefined;

  @ViewChild('dropoff') deliveryAddressInput: ElementRef<HTMLInputElement> | undefined;

  showMap: boolean = false;
  hideMap: boolean = false;
  mapFor: 'pickup' | 'dropoff' = 'pickup';

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrdersService,
    private locationService: LocationService,
    private toastr: ToastrService,
    private yaGeocoderService: YaGeocoderService
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

  ngOnInit(): void { }

  handleStageChange(stage: Stage): void {
    // Find the index of the stage to be updated
    const stageIndex = this.newOrderStages.findIndex(s => s.value === stage.value);

    // Create a new Stage object with 'visited' set to true
    const updatedStage = { ...this.newOrderStages[stageIndex], visited: true };

    // Update the specific stage in the array
    const updatedStages = [
      ...this.newOrderStages.slice(0, stageIndex),
      updatedStage,
      ...this.newOrderStages.slice(stageIndex + 1)
    ];

    // Update the current stage and the stages array
    this.newOrderStage = updatedStage;
    this.newOrderStages = updatedStages;
  }

  goToStage(value: 'location' | 'details' | 'confirmation') {
    const stageIndex = this.newOrderStages.findIndex(stage => stage.value === value);

    if (value !== 'location' && this.newOrderForm.get('location')?.invalid) {
      this.toastr.info('Please complete the delivery route information before proceeding.');
      return;
    }

    if (!['details', 'location'].includes(value) && this.newOrderForm.get('details')?.invalid) {
      this.toastr.info('Please complete the order details before proceeding.');
      return;
    }

    if (stageIndex !== -1) {
      this.newOrderStages = this.newOrderStages.map((stage, index) => ({
        ...stage,
        visited: index <= stageIndex
      }));

      this.newOrderStage = this.newOrderStages[stageIndex];
    }
  }

  initUserDetails(): void {
    this.recentDeliveriesLocation = this.user.orders?.filter(order => order.status === 'Delivered').map(order => order.deliveryAddress) || [];
  }

  initForm(): void {
    this.newOrderForm = new FormGroup({
      location: new FormGroup({
        pickup: new FormGroup({
          address: new FormControl(null, [Validators.required]),
          city: new FormControl(null),
          state: new FormControl(null),
          postalCode: new FormControl(null),
          country: new FormControl('Russia', [Validators.required]),
          locationType: new FormControl(null, [Validators.required]),
        }),
        delivery: new FormGroup({
          address: new FormControl(null, [Validators.required]),
          city: new FormControl(null, [Validators.required]),
          state: new FormControl(null, [Validators.required]),
          postalCode: new FormControl(null),
          country: new FormControl('Russia', [Validators.required]),
          locationType: new FormControl(null, [Validators.required]),
        }),
      }),
      details: new FormGroup({
        title: new FormControl(null, Validators.required)
      }),
    });

    if (this.userCurrentLocation) {
      this.newOrderForm.get('location.pickup.address')?.patchValue(this.userCurrentLocation.street);
      this.newOrderForm.get('location.pickup')?.patchValue(this.userCurrentLocation);
      setTimeout(() => {
        this.deliveryAddressInput?.nativeElement.focus();
      }, 500);
    }

    this.newOrderForm.valueChanges.subscribe(value => {
      const pickupAddressControl = this.newOrderForm.get('location.pickup');
      const deliveryAddressControl = this.newOrderForm.get('location.delivery');

      if (pickupAddressControl?.valid && !deliveryAddressControl?.valid) {
        setTimeout(() => {
          this.deliveryAddressInput?.nativeElement.focus();
        }, 500);
      } else if (!pickupAddressControl?.valid) {
        setTimeout(() => {
          this.pickupAddressInput?.nativeElement.focus();
        }, 500);
      } else {
        // Both addresses are valid, blur the inputs and move to the next stage
        this.pickupAddressInput?.nativeElement.blur();
        this.deliveryAddressInput?.nativeElement.blur();
        this.goToStage('details');
      };
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

  pickupIsFocused: boolean = false;
  pickupOnFocus(): void {
    setTimeout(() => {
      this.pickupIsFocused = true;
    }, 1000);
  }

  pickupOnBlur(): void {
    setTimeout(() => {
      this.pickupIsFocused = false;
    }, 1000);
  }

  deliveryIsFocused: boolean = false;
  deliveryOnFocus(): void {
    setTimeout(() => {
      this.deliveryIsFocused = true;
    }, 1000);
  }

  deliveryOnBlur(): void {
    setTimeout(() => {
      this.deliveryIsFocused = false;
    }, 1000);
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
        this.locationService.searchLocations(searchvalue, 'pickup').subscribe((locations) => {
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
        this.locationService.searchLocations(searchvalue, 'delivery').subscribe((locations) => {
          this.searchingDelivery = false;
          this.foundLocations = locations;
        });
      }
    }
  }

  selectAddress(address: Address): void {
    const { pickupAddress, deliveryAddress, searchedForPickupAddress, searchedForDeliveryAddress, newOrderForm } = this;

    if (this.deliveryIsFocused) {
      newOrderForm.get('location.delivery.address')?.patchValue(address.street);
      newOrderForm.get('location.delivery')?.patchValue(address);
      this.foundLocations = [];
      return;
    }

    if (this.pickupIsFocused) {
      newOrderForm.get('location.pickup.address')?.patchValue(address.street);
      newOrderForm.get('location.pickup')?.patchValue(address);
      this.foundLocations = [];
      console.log(newOrderForm.value);
      return;
    }

    if (!this.pickupIsFocused && !this.deliveryIsFocused) {
      if (address.type === 'pickup') {
        newOrderForm.get('location.pickup.address')?.patchValue(address.street);
        newOrderForm.get('location.pickup')?.patchValue(address);
        this.foundLocations = [];
        return;
      } else {
        newOrderForm.get('location.delivery.address')?.patchValue(address.street);
        newOrderForm.get('location.delivery')?.patchValue(address);
        this.foundLocations = [];
        return;
      }
    }

    if ((pickupAddress !== '' && searchedForPickupAddress) || pickupAddress === '') {
      newOrderForm.get('location.pickup.address')?.patchValue(address.street);
      newOrderForm.get('location.pickup')?.patchValue(address);
    } else if ((deliveryAddress !== '' && searchedForDeliveryAddress) || deliveryAddress === '') {
      newOrderForm.get('location.delivery.address')?.patchValue(address.street);
      newOrderForm.get('location.delivery')?.patchValue(address);
    } else {
      // Default case: if neither specific condition is met, default to pickup
      newOrderForm.get('location.pickup.address')?.patchValue(address.street);
      newOrderForm.get('location.pickup')?.patchValue(address);
    }

    this.foundLocations = [];
    console.log(newOrderForm.value);
  }

  get selectedType(): 'pickup' | 'delivery' {
    return this.deliveryIsFocused ? 'delivery' : this.pickupIsFocused ? 'pickup' : 'pickup';
  }

  getStageIcon(stage: Stage, index: number): string {
    let icon = '';
    switch (stage.visited) {
      case false:
        icon = `bi-${index}-circle`
        break;
      default:
        icon = 'bi-check-circle-fill'
        break;
    };
    return icon;
  }

  openMap(isFor: 'pickup' | 'dropoff'): void {
    this.mapFor = isFor;

    if (this.showMap) {
      this.hideMap = true;
      setTimeout(() => {
        this.showMap = false;
      }, 1000);
    } else {
      this.hideMap = false;
      this.showMap = true;
    }
  }

  closeMap() {
    this.hideMap = true;
    setTimeout(() => {
      this.showMap = false;
    }, 1000);
  }
}
