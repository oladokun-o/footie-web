import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Adjust the path as needed
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { User, KYCStep, UserRole } from '../interfaces/user.interface'; // Ensure UserRole is imported
import { KycService } from '../services/kyc.service';

/**
 * The KYC guard is used to restrict access to certain pages based on the user's KYC status.
 * If the user is not a courier, they will be allowed to access the page.
 * If the user is a courier, they will be redirected to the KYC process if their KYC status is not approved.
 * If the user is a courier and their KYC status is approved, they will be allowed to access the page.
 * If the user is not logged in, they will be redirected to the login page.
 */
@Injectable({
  providedIn: 'root'
})
export class KycGuard implements CanActivate {

  get userData(): { email: string, userId: string } {
    return JSON.parse(localStorage.getItem('userSessionData') as string);
  }

  get user(): User {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  }

  queryParamUserId: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private kycService: KycService
  ) {
    this.route.queryParams.subscribe(params => {
      this.queryParamUserId = params['userId'];
    });
  }

  canActivate(): Observable<boolean> {
    const user = this.user;
    const userData = this.userData;
    const queryParamUserId = this.queryParamUserId;

    if (queryParamUserId) {
      return this.kycService.getUserByIDForVerification(queryParamUserId).pipe(
        map(fetchedUser => {
          if (fetchedUser) {
            return this.checkUserRoleAndKycStatus(fetchedUser);
          } else {
            this.router.navigate(['/login']);
            this.toastr.error('User not found. Please log in again.');
            return false;
          }
        }),
        catchError(error => {
          this.toastr.error('An error occurred. Please try again.');
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }

    if (user) {
      return of(this.checkUserRoleAndKycStatus(user));
    }

    if (userData && userData.email) {
      return this.userService.getUserByEmail(userData.email).pipe(
        map(fetchedUser => {
          if (fetchedUser) {
            return this.checkUserRoleAndKycStatus(fetchedUser);
          } else {
            this.router.navigate(['/login']);
            this.toastr.error('User not found. Please log in again.');
            return false;
          }
        }),
        catchError(error => {
          this.toastr.error('An error occurred. Please try again.');
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }

    this.router.navigate(['/login']);
    this.toastr.error('Please log in to access this page');
    return of(false);
  }

  private checkUserRoleAndKycStatus(user: User): boolean {
    // Only apply KYC checks for users with the role of UserRole.COURIER
    if (user.role === UserRole.COURIER) {
      return this.checkKycStatus(user);
    } else {
      return true; // Allow access if the user is not a courier
    }
  }

  private checkKycStatus(user: User): boolean {
    if (user.kyc && user.kyc.status === 'approved') {
      return true; // Allow access if KYC is approved
    } else {
      this.toastr.info('You need to complete and have your KYC approved to access the dashboard');
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


/**
 * The KYC role guard is used to restrict access to certain pages based on the user's role.
 * In this case, the guard is used to restrict access to the KYC process to users with the role of courier.
 * If the user is not a courier, they will be redirected to the dashboard or another page.
 * If the user is a courier, they will be allowed to access the KYC process.
 */
@Injectable({
  providedIn: 'root'
})
export class KycRoleGuard implements CanActivate {

  get userData(): { email: string, userId: string } {
    return JSON.parse(localStorage.getItem('userSessionData') as string);
  }

  get user(): User {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  }

  queryParamUserId: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private kycService: KycService
  ) {
    this.route.queryParams.subscribe(params => {
      this.queryParamUserId = params['userId'];
    });
  }

  canActivate(): Observable<boolean> {
    const user = this.user;
    const userData = this.userData;
    const queryParamUserId = this.queryParamUserId;

    if (queryParamUserId) {
      return this.kycService.getUserByIDForVerification(queryParamUserId).pipe(
        map(fetchedUser => {
          if (fetchedUser) {
            return this.checkUserRole(fetchedUser);
          } else {
            this.router.navigate(['/login']);
            this.toastr.error('User not found. Please log in again.');
            return false;
          }
        }),
        catchError(error => {
          this.toastr.error('An error occurred. Please try again.');
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }

    if (user) {
      return of(this.checkUserRole(user));
    }

    if (userData && userData.email) {
      return this.userService.getUserByEmail(userData.email).pipe(
        map(fetchedUser => {
          if (fetchedUser) {
            return this.checkUserRole(fetchedUser);
          } else {
            this.router.navigate(['/login']);
            this.toastr.error('User not found. Please log in again.');
            return false;
          }
        }),
        catchError(error => {
          this.toastr.error('An error occurred. Please try again.');
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }

    // If no user data is found, redirect to login
    this.router.navigate(['/login']);
    this.toastr.error('Please log in to access this page');
    return of(false);
  }

  private checkUserRole(user: User): boolean {
    if (user.role === UserRole.COURIER) {
      return true; // Allow access if user is a courier
    } else {
      this.router.navigate(['/dashboard']); // Redirect to dashboard or another page
      // this.toastr.error('You do not have access to this page.');
      return false; // Block access
    }
  }
}
