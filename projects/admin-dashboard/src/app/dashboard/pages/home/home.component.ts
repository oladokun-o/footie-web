import { Component, OnInit } from '@angular/core';
import { KYCStep, User, UserKYC } from '../../../core/interfaces/user.interface';
import { KycService } from '../../../core/services/kyc.service';

@Component({
  selector: 'admin-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User | null = JSON.parse(localStorage.getItem('user') as string);
  pageTitle: string = this.user ? `Welcome, ${this.user.firstName}` : 'Welcome';

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

  getRecentRecords(): UserKYC[] {
    // Sort the records by 'createdAt' in descending order (newest first)
    // Then slice the array to get the first 5 records
    return this.kycRecords
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
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
