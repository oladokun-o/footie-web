import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, ItemType } from 'src/app/core/interfaces/order.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { mockData, mockLocation } from 'src/app/utils/orders/order.mock';
import * as Chance from 'chance';
import { OrdersService } from 'src/app/core/services/orders.service';
import { OrdersHelpers } from 'src/app/utils/orders/helpers';
import { LocationService } from 'src/app/core/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { YaGeocoderService } from 'angular8-yandex-maps';
import { Subscription, switchMap, tap } from 'rxjs';
import { Region, UserLocation } from 'src/app/core/interfaces/location.interface';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { MatDialog } from '@angular/material/dialog';
import { CancelOrderComponent } from '../../modals/cancel-order/cancel-order.component';
const chance = new Chance();

interface Stage {
  value: 'location' | 'details' | 'confirmation', label: string, visited: boolean
}

@Component({
  selector: 'footiedrop-web-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent extends OrdersHelpers implements OnInit, OnDestroy {
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
  get userCurrentLocation(): Address { return JSON.parse(localStorage.getItem('userCurrentLocation') as string) };

  @ViewChild('pickup') pickupAddressInput: ElementRef<HTMLInputElement> | undefined;

  @ViewChild('dropoff') deliveryAddressInput: ElementRef<HTMLInputElement> | undefined;

  showMap: boolean = false;
  hideMap: boolean = false;
  mapFor: 'pickup' | 'dropoff' = 'pickup';

  prohibitedItems: string[] = ['lorem', 'ipsum', 'carte'];
  showProhibitedItems: boolean = false;

  itemTypes: string[] = Object.values(ItemType).map(i => i.toUpperCase());
  deliveryModes: string[] = ['Foot'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrdersService,
    private locationService: LocationService,
    private toastr: ToastrService,
    private yaGeocoderService: YaGeocoderService,
    private router: Router,
    public dialog: MatDialog
  ) {
    super();

    // check if the service is available in the region
    if (this.userCurrentLocation) {
      this.checkIfServiceAvailableForUserCurrentLocation();
    }

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

  ngOnDestroy(): void {
    this.toastr.clear();
  }

  checkIfServiceAvailableForUserCurrentLocation(): void {
    const allowedRegions: Region[] = [
      {
        name: 'Russia',
        code: 'rus',
      }
    ];

    const location = this.userCurrentLocation;
    const isAllowed = allowedRegions.some(region => location.country.toLowerCase().includes(region.code.toLowerCase()));

    if (!isAllowed) {
      this.toastr.warning('Service is not available in your current location.', '', {
        disableTimeOut: true,
        tapToDismiss: false,
      });
    }
  }

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
      this.newOrderForm.get('details')?.markAllAsTouched();
      return;
    }

    if (stageIndex !== -1) {
      this.newOrderStages = this.newOrderStages.map((stage, index) => ({
        ...stage,
        visited: index <= stageIndex
      }));

      this.newOrderStage = this.newOrderStages[stageIndex];
      if (this.newOrderStage.value === 'details') {
        this.calculateTrip();
      }
    }
  }

  initUserDetails(): void {
    this.recentDeliveriesLocation = this.user.orders?.filter(order => order.status === 'Delivered').map(order => order.deliveryAddress) || [];
    console.log(this.recentDeliveriesLocation);
  }

  initForm(): void {
    this.newOrderForm = new FormGroup({
      location: new FormGroup({
        pickup: new FormGroup({
          address: new FormControl(null, [Validators.required]),
          city: new FormControl(null),
          state: new FormControl(null),
          postalCode: new FormControl(null),
          floorOrApartment: new FormControl(null),
          country: new FormControl('Russia', [Validators.required]),
          locationType: new FormControl(null, [Validators.required]),
          coordinates: new FormControl(null, [Validators.required]),
        }),
        delivery: new FormGroup({
          address: new FormControl(null, [Validators.required]),
          city: new FormControl(null),
          state: new FormControl(null),
          postalCode: new FormControl(null),
          floorOrApartment: new FormControl(null),
          country: new FormControl('Russia', [Validators.required]),
          locationType: new FormControl(null, [Validators.required]),
          coordinates: new FormControl(null, [Validators.required]),
        }),
      }),
      details: new FormGroup({
        sender: new FormGroup({
          name: new FormControl(this.user.firstName + ' ' + this.user.lastName, [Validators.required]),
          phone: new FormControl(this.user.phone, [Validators.required]),
          email: new FormControl(this.user.email, [Validators.required]),
          userId: new FormControl(this.user.id, [Validators.required]),
        }),
        recipient: new FormGroup({
          firstName: new FormControl(null, [Validators.required]),
          lastName: new FormControl(null, [Validators.required]),
          phone: new FormControl(null, [Validators.required]),
          email: new FormControl(null, [Validators.email]),
        }),
        package: new FormGroup({
          title: new FormControl(null, [Validators.required]),
          type: new FormControl('GADGET', [Validators.required]),
          quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
          size: new FormControl('1KG', [Validators.required]),
          image: new FormControl(null, [Validators.required]),
          modeOfDelivery: new FormControl('foot', [Validators.required]),
          message: new FormControl(null)
        })
      }),
      payment: new FormGroup({
        price: new FormControl(0, [Validators.required]),
      })
    });

    if (this.userCurrentLocation) {
      this.newOrderForm.get('location.pickup.address')?.patchValue(this.userCurrentLocation.address);
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

  get estimatedFee(): number {
    return this.newOrderForm.get('payment.price')?.value as number;
  }

  setPackageSize(value: string): void {
    this.newOrderForm.get('details.package.size')?.setValue(value);
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
      this.mapFor = 'pickup'
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
      this.mapFor = 'dropoff'
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

    const updatePickupAddressForm = () => {
      newOrderForm.get('location.pickup.address')?.patchValue(address.address);
      newOrderForm.get('location.pickup')?.patchValue(address);
      this.foundLocations = [];
    }

    const updateDeliveryAddressForm = () => {
      newOrderForm.get('location.delivery.address')?.patchValue(address.address);
      newOrderForm.get('location.delivery')?.patchValue(address);
      this.foundLocations = [];
      console.log(this.newOrderForm.value)
    }

    if (this.mapFor === 'pickup') {
      updatePickupAddressForm();
      return;
    } else if (this.mapFor === 'dropoff') {
      updateDeliveryAddressForm();
      return;
    }

    if (this.deliveryIsFocused) {
      updateDeliveryAddressForm();
      return;
    }

    if (this.pickupIsFocused) {
      updatePickupAddressForm();
      console.log(newOrderForm.value);
      return;
    }

    if (!this.pickupIsFocused && !this.deliveryIsFocused) {
      if (address.type === 'pickup') {
        updatePickupAddressForm();
        return;
      } else {
        updateDeliveryAddressForm();
        return;
      }
    }

    if ((pickupAddress !== '' && searchedForPickupAddress) || pickupAddress === '') {
      updatePickupAddressForm();
    } else if ((deliveryAddress !== '' && searchedForDeliveryAddress) || deliveryAddress === '') {
      updateDeliveryAddressForm();
    } else {
      // Default case: if neither specific condition is met, default to pickup
      updatePickupAddressForm();
    }
  }

  get selectedType(): 'pickup' | 'delivery' {
    return this.deliveryIsFocused ? 'delivery' : this.pickupIsFocused ? 'pickup' : 'pickup';
  }

  get selectedTypeAddress(): Address {
    if (this.selectedType === 'pickup') {
      return this.newOrderForm.get('location.pickup')?.value as Address;
    } else {
      return this.newOrderForm.get('location.delivery')?.value as Address;
    }
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

  calculateTrip() {
    this.newOrderForm.get('payment.price')?.patchValue(2000, { emitEvent: false });
  }

  closeMap() {
    this.hideMap = true;
    this.showMap = false;
  }

  public file: File | null = null;
  public fileUrl: string | null = null;
  public fileDropErrorMessage: string = '';
  private maxFileSize = 5242880; // 5MB

  public dropped(files: NgxFileDropEntry[]) {
    this.handleFileDrop(files);
  }

  public changeFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFile(file);
    }
  }

  private handleFileDrop(files: NgxFileDropEntry[]) {
    this.fileDropErrorMessage = '';

    if (files.length > 0) {
      const droppedFile = files[0];

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.handleFile(file);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  private handleFile(file: File) {
    if (this.isFileTypeAccepted(file)) {
      if (this.isFileSizeAccepted(file)) {
        if (this.fileUrl) {
          URL.revokeObjectURL(this.fileUrl);
        }
        this.file = file;
        this.fileUrl = URL.createObjectURL(file);
        this.newOrderForm.get('details.package.image')?.setValue(this.fileUrl);
      } else {
        this.fileDropErrorMessage = 'File size exceeds the 5MB limit.';
      }
    } else {
      this.fileDropErrorMessage = 'Only image files (PNG, JPEG) are allowed.';
    }
  }

  private isFileTypeAccepted(file: File): boolean {
    const acceptedTypes = ['image/png', 'image/jpeg'];
    return acceptedTypes.includes(file.type);
  }

  private isFileSizeAccepted(file: File): boolean {
    return file.size <= this.maxFileSize;
  }

  public removeFile(): void {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }
    this.file = null;
    this.fileUrl = null;
    this.newOrderForm.get('details.package.image')?.setValue(null);
  }

  // Confirmation
  confirming: boolean = false;

  confirm(): void {
    if (this.newOrderForm.valid) {
      this.confirming = true;

      console.log(this.newOrderForm.value)

      setTimeout(() => {
        this.toastr.info('Feature is ongoing development!');
        this.router.navigate(['/dashboard/orders']);
      }, 2000);
    };
  }

  cancel(): void {
    const ref = this.dialog.open(CancelOrderComponent);
    ref.componentInstance.why = 'Are you sure you want to cancel? <br> You\'ll lose your changes.';
    ref.componentInstance.options = [];
    ref.componentInstance.selectedOption = { value: 'null', viewValue: 'null' }
    ref.afterClosed().subscribe((reason) => {
      if (reason) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
