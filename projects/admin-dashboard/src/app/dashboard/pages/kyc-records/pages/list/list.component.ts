import { Component } from '@angular/core';
import { User, UserKYC, KYCStep } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';
import { KycService } from 'projects/admin-dashboard/src/app/core/services/kyc.service';

@Component({
  selector: 'admin-app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  user: User | null = JSON.parse(localStorage.getItem('user') as string);

  kycRecords: UserKYC[] = [];
  loadingRecords: boolean = false;

  get kycRecordsCount(): number {
    return this.kycRecords.length;
  }

  constructor(
    private kycService: KycService,
  ) {
    // call getKYCList method
    this.getKYCList();
  }

  ngOnInit(): void {

  }

  getKYCList(): void {
    this.loadingRecords = true;
    this.kycService.listKYCRecords().subscribe(
      (response) => {
        if (response.result === 'success') {
          this.kycRecords = response.data;
        }
      },
      (error) => {
        console.error('Error fetching KYC records', error);
      },
      () => {
        this.loadingRecords = false;
      }
    );
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
