import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map } from 'rxjs';
import { KYCStep, User } from 'src/app/core/interfaces/user.interface';
import { KycService } from 'src/app/core/services/kyc.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'footiedrop-web-continue-kyc',
  templateUrl: './continue-kyc.component.html',
  styleUrls: ['./continue-kyc.component.scss']
})
export class ContinueKycComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private kycService: KycService
  ) {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        this.getUser(userId);
      } else {
        this.router.navigate(['/login']);
        this.toastr.error('User not found. Please log in again.');
      }
    });
  }

  private getUser(userId: string): void {
    this.kycService.getUserByIDForVerification(userId).subscribe(
      (fetchedUser) => {
        if (fetchedUser) {
          const session: { email: string, userId: string } = {
            email: fetchedUser.email,
            userId: fetchedUser.id
          };
          localStorage.setItem('userSessionData', JSON.stringify(session));
          this.checkKycStatus(fetchedUser);
        } else {
          this.router.navigate(['/login']);
          this.toastr.error('User not found. Please log in again.');
        }
      },
      (error) => {
        this.toastr.error('An error occurred. Please try again.');
        this.router.navigate(['/login']);
      }
    )
  }

  private checkKycStatus(user: User): boolean {
    if (user.kyc && user.kyc.status === 'approved') {
      return true; // Allow access if KYC is approved
    } else {
      if (user.kyc && user.kyc.step === KYCStep.START) this.toastr.info('You need to complete and have your KYC approved to access the dashboard');
      this.navigateToKycStep(user); // Navigate to the relevant KYC step
      return false; // Block access
    }
  }

  private navigateToKycStep(user: User): void {
    if (user.kyc && user.kyc.step) {
      switch (user.kyc.step) {
        case KYCStep.SUBMIT_SELFIE:
          this.router.navigate(['/kyc/selfie']);
          break;
        case KYCStep.SUBMIT_INTERNATIONAL_PASSPORT:
          this.router.navigate(['/kyc/international-passport']);
          break;
        case KYCStep.SUBMIT_RUSSIAN_PASSPORT:
          this.router.navigate(['/kyc/russian-passport']);
          break;
        case KYCStep.REVIEW:
          this.router.navigate(['/kyc/review']);
          break;
        default:
          this.initiateKyc(); // If the step is not recognized, re-initiate KYC
          break;
      }
    } else {
      this.initiateKyc(); // If no KYC step exists, start the process
    }
  }

  private initiateKyc(): void {
    this.router.navigate(['/kyc']); // Redirect to the first step of the KYC process
  }
}
