import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { User, UserKYC, KYCStep } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';
import { kycActions } from 'projects/admin-dashboard/src/app/core/store/actions/kyc.action';
import { KycState } from 'projects/admin-dashboard/src/app/core/store/reducers/kyc.reducer';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'admin-app-kyc-list',
  templateUrl: './kyc-list.component.html',
  styleUrls: ['./kyc-list.component.scss']
})
export class KycListComponent {
  user: User | null = JSON.parse(localStorage.getItem('user') as string);

  @Input() tableTitle: string = 'Manage KYC Records';
  @Input() tableFooter: { text: string, link: string } = { text: '', link: '' };

  kycRecords$: Observable<UserKYC[]>;
  loading$: Observable<boolean>;
  kycRecordsCount$: Observable<number>;

  constructor(
    private store: Store<{ kyc: KycState }>
  ) {
    this.kycRecords$ = this.store.select('kyc', 'kycRecords');
    this.loading$ = this.store.select('kyc', 'loading');

    this.kycRecordsCount$ = this.kycRecords$.pipe(
      map((records) => records.length)
    );
  }

  ngOnInit(): void { }

  refreshKYCRecords(): void {
    this.store.dispatch(kycActions.loadKycRecords());
  }

  handleImgError(event: HTMLImageElement): void {
    event.src = 'assets/images/icons/profile-icon.svg';
  }

  showKYCStep(step: KYCStep): string {
    switch (step) {
      case KYCStep.START:
        return 'Started';
      case KYCStep.SUBMIT_SELFIE:
        return 'Missing Selfie';
      case KYCStep.SUBMIT_INTERNATIONAL_PASSPORT:
        return 'Missing International Passport';
      case KYCStep.SUBMIT_RUSSIAN_PASSPORT:
        return 'Missing Russian Passport';
      case KYCStep.SUBMIT_SCHOOL_ID:
        return 'Missing School ID';
      case KYCStep.REVIEW:
        return 'In Review';
      case KYCStep.COMPLETE:
        return 'Completed';
    }
  }

  getKYCStatusBootsrapClass(status: 'pending' | 'approved' | 'rejected'): string {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
