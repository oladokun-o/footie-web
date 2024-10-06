import { AfterContentChecked, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User, UserKYC } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';
import { kycActions } from 'projects/admin-dashboard/src/app/core/store/actions/kyc.action';
import { KycState } from 'projects/admin-dashboard/src/app/core/store/reducers/kyc.reducer';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'admin-app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements AfterContentChecked {
  kycRecord$!: Observable<UserKYC | undefined>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  recordID!: string;

  constructor(
    private store: Store<{ kyc: KycState }>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Get the ID from the route query params
    this.route.params.pipe(
      map(params => params['id'])
    ).subscribe(id => {
      if (id) {
        this.recordID = id;
      }
    });
  }

  ngAfterContentChecked(): void {
    if (this.recordID) {
      // Dispatch action to load the KYC record by ID
      this.store.dispatch(kycActions.selectKycRecord({ id: this.recordID }));

      this.kycRecord$ = this.store.select('kyc', 'selectedRecord');
      this.loading$ = this.store.select('kyc', 'loading');
      this.error$ = this.store.select('kyc', 'error');
    }
  }

  handleImgError(event: HTMLImageElement): void {
    event.src = 'assets/images/icons/profile-icon.svg';
  }

  getUserAddress(user: User): string {
    let address = '';
    if (user.apartment_number) {
      address += user.apartment_number + ', ';
    };
    if (user.addressStreet) {
      address += user.addressStreet + ', ';
    };
    if (user.addressCity) {
      address += user.addressCity + ', ';
    };
    if (user.addressState) {
      address += user.addressState + ', ';
    }
    if (user.addressCountry) {
      address += user.addressCountry + ', ';
    };
    if (user.zip_code) {
      address += user.zip_code;
    };

    if (address === '') {
      address = 'N/A';
    }

    return address;
  }
}
