import { Component, inject, Input } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { User, UserKYC, KYCStep } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';
import { kycActions } from 'projects/admin-dashboard/src/app/core/store/actions/kyc.action';
import { KycState } from 'projects/admin-dashboard/src/app/core/store/reducers/kyc.reducer';
import { selectFilteredKycRecords } from 'projects/admin-dashboard/src/app/core/store/selectors/kyc.selector';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'admin-app-kyc-list',
  templateUrl: './kyc-list.component.html',
  styleUrls: ['./kyc-list.component.scss']
})
export class KycListComponent {
  user: User | null = JSON.parse(localStorage.getItem('user') as string);

  @Input() tableTitle: string = '';
  @Input() tableFooter: { text: string, link: string } = { text: '', link: '' };
  @Input() showTableFilter: boolean = true;

  kycRecords$: Observable<UserKYC[]>;
  filteredKycRecords$: Observable<UserKYC[]>;
  loading$: Observable<boolean>;
  kycRecordsCount$: Observable<number>;

  activeFilter: string = 'none';
  filters: string[] = ['none', 'status', 'date'];

  statusFilters: { label: string, value: 'pending' | 'approved' | 'rejected' }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];
  activeStatusFilter: 'pending' | 'approved' | 'rejected' = 'pending';

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);
  currentDate: NgbDateStruct = this.calendar.getToday();
  minDateRange: NgbDateStruct = { year: 2024, month: 9, day: 1 };
  maxDateRange: NgbDateStruct = { year: this.currentDate.year, month: this.currentDate.month, day: this.currentDate.day };

  dateRangeModel: { startDate: Date | null, endDate: Date | null } = {
    startDate: new Date(this.minDateRange.year, this.minDateRange.month - 1, this.minDateRange.day),
    endDate: new Date(this.maxDateRange.year, this.maxDateRange.month - 1, this.maxDateRange.day)
  };
  dateRange: { startDate: Date | null, endDate: Date | null } = { ...this.dateRangeModel };

  constructor(
    private store: Store<{ kyc: KycState }>
  ) {
    let kycRecordsSub = this.store.select('kyc', 'kycRecords');
    this.filteredKycRecords$ = this.store.select(selectFilteredKycRecords);

    // If there are no filters, return the original records; otherwise, return the filtered ones.
    this.kycRecords$ = combineLatest([kycRecordsSub, this.filteredKycRecords$]).pipe(
      map(([kycRecords, filteredRecords]) => {
        // Check if filteredRecords is the same as kycRecords (no filtering applied)
        const isFiltered = filteredRecords.length !== kycRecords.length;

        // Return the filtered list if filters are applied, else return the original list
        return isFiltered ? filteredRecords : kycRecords;
      })
    );

    this.loading$ = this.store.select('kyc', 'loading');

    this.kycRecordsCount$ = this.kycRecords$.pipe(
      map((records) => records.length)
    );
  }

  ngOnInit(): void { }

  onSearchTermChange(query: string): void {
    this.store.dispatch(kycActions.updateFilter({ filters: { query } }));
  }

  onFilterChange(filter: string): void {
    this.activeFilter = filter;
  }

  onStatusChange(status: 'pending' | 'approved' | 'rejected'): void {
    this.store.dispatch(kycActions.updateFilter({ filters: { status } }));
    this.activeStatusFilter = status;
  }

  onDateRangeChange(event: NgbDate, type: 'start' | 'end'): void {
    const date = new Date(event.year, event.month - 1, event.day);

    if (type === 'start') {
      this.dateRange = {
        ...this.dateRange,
        startDate: date
      }
    } else {
      this.dateRange = {
        ...this.dateRange,
        endDate: date
      }
    }

    this.store.dispatch(kycActions.updateFilter({ filters: { dateRange: this.dateRange } }));
  }

  clearFilters(): void {
    this.onFilterChange('none');
    this.onStatusChange('pending');
    this.dateRangeModel = {
      startDate: new Date(this.minDateRange.year, this.minDateRange.month - 1, this.minDateRange.day),
      endDate: new Date(this.maxDateRange.year, this.maxDateRange.month - 1, this.maxDateRange.day)
    };
    this.dateRange = this.dateRangeModel;
    this.store.dispatch(kycActions.updateFilter({
      filters: {
        dateRange: {
          startDate: null, endDate: null
        }
      }
    }));
  }

  refreshKYCRecords(): void {
    this.store.dispatch(kycActions.loadKycRecords());
  }

  handleImgError(event: HTMLImageElement): void {
    event.src = 'assets/images/icons/profile-icon.svg';
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

  getKYCStatusBootstrapClass(status: 'pending' | 'approved' | 'rejected'): string {
    const statusClasses = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
    };
    return statusClasses[status] || 'secondary';
  }
}
