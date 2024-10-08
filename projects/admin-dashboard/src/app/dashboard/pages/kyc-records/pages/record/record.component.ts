import { AfterContentChecked, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Tab } from 'projects/admin-dashboard/src/app/core/interfaces/index.interface';
import { KYCStep, User, UserKYC } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';
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

  copiedUserId: boolean = false;
  copiedKycId: boolean = false;

  tabs: Tab[] = [
    {
      title: 'KYC Information',
      active: true,
      disabled: false,
      content: 'kyc'
    },
    {
      title: 'Documents',
      active: false,
      disabled: false,
      content: 'documents'
    },
    {
      title: 'Additional Information',
      active: false,
      disabled: true,
      content: 'additional'
    }
  ];
  activeTab: Tab = this.tabs[0];

  canEditKYC: boolean = false;
  canEditDocuments: boolean = false;

  get canSave(): boolean {
    return this.canEditKYC || this.canEditDocuments;
  }

  constructor(
    private store: Store<{ kyc: KycState }>,
    private route: ActivatedRoute,
    private router: Router,
    private config: NgbTooltipConfig) {
    // Get the ID from the route query params
    this.route.params.pipe(
      map(params => params['id'])
    ).subscribe(id => {
      if (id) {
        this.recordID = id;
      }
    });

    // Get active tab from the route query params
    this.route.queryParams.pipe(
      map(params => params['tab'])
    ).subscribe(tab => {
      if (tab) {
        let activeTab = this.tabs.find(t => t.content === tab) as Tab;
        this.tabs.forEach(t => {
          t.active = t.content === activeTab.content;
        });
        this.activeTab = activeTab;
      }
    });

    // Optional: You can set default tooltip behavior here
    this.config.placement = 'top';
    this.config.triggers = 'hover';
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

  onCopySuccess(type: 'user' | 'kyc'): void {
    if (type === 'user') {
      this.copiedUserId = true;
    } else if (type === 'kyc') {
      this.copiedKycId = true;
    }

    // Reset the copied state and remove the highlight after 2 seconds
    setTimeout(() => {
      if (type === 'user') {
        this.copiedUserId = false;
      } else if (type === 'kyc') {
        this.copiedKycId = false;
      }
    }, 2000); // Adjust this duration as needed
  }

  editPersonalInfo(): void {
    // update tab state
    let tab = this.tabs.find(t => t.content === 'personal') as Tab;
    this.tabs.forEach(t => {
      t.active = t.content === tab.content;
    });
    this.activeTab = tab;
  }

  showKYCStep(step: KYCStep): string {
    const stepLabels = {
      [KYCStep.START]: 'Started',
      [KYCStep.SUBMIT_SELFIE]: 'Missing Selfie',
      [KYCStep.SUBMIT_INTERNATIONAL_PASSPORT]: 'Missing International Passport',
      [KYCStep.SUBMIT_RUSSIAN_PASSPORT]: 'Missing Russian Passport',
      [KYCStep.SUBMIT_SCHOOL_ID]: 'Missing School ID',
      [KYCStep.REVIEW]: 'In Review',
      [KYCStep.COMPLETE]: 'Completed',
    };
    return stepLabels[step] || 'Unknown Step';
  }
}
