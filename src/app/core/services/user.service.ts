import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestResponse } from '../interfaces/index.interface';
import { CreateUserDto } from '../dto/user.dto';
import { Observable, tap, switchMap, of, throwError, catchError } from 'rxjs';
import { ApiEndpoints } from '../configs/api.config';
import { User } from '../interfaces/user.interface';
import { Address } from '../interfaces/order.interface';
import { Region } from '../interfaces/location.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private userHelperService: UserHelperService
  ) { }

  get user(): User {
    return JSON.parse(localStorage.getItem('user') as string);
  }

  create(payload: CreateUserDto): Observable<any> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.users.create(), payload).pipe(
      tap(response => {
        if (response.result === "success") {
          localStorage.setItem("userSessionData", JSON.stringify({
            email: response.data.email,
            userId: response.data.id,
          }));
        }
      }),
      switchMap(response => {
        if (response.result === "success") {
          return of(response.data); // Return the data if successful
        } else {
          return throwError(response.message); // Throw an error if not successful
        }
      }),
      catchError(error => {
        return throwError(error.error)
      }) // Handle any HTTP error
    );
  }

  verifyOTP(payload: { email: string, otp: number }): Observable<any> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.users.verifyOTP(), payload).pipe(
      switchMap(response => {
        if (response.result === "success") this.getUserByEmail(payload.email).subscribe(user => localStorage.setItem("user", JSON.stringify(user)));
        return response.result === "success" ? of(response.data) : throwError(response.message);
      }),
      catchError(error => throwError(error)),
    );
  }

  resendOtp(email: string): Observable<any> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.users.resendOtp(), { email: email }).pipe(
      switchMap(response => response.result === "success" ? of(response.data) : throwError(response.message)),
      catchError(error => throwError(error.error)),
    );
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<RequestResponse>(ApiEndpoints.users.getById(id)).pipe(
      switchMap(response => response.result === "success" ? of(this.userHelperService.CheckUserSettings(response.data)) : throwError(response.message)),
      catchError(error => throwError(error.error)),
    );
  }

  getUserByEmail(email: string): Observable<User> {
    return this.httpClient.get<RequestResponse>(ApiEndpoints.users.getByEmail(email)).pipe(
      switchMap(response => response.result === "success" ? of(this.userHelperService.CheckUserSettings(response.data)) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }

  getUserByEmailForVerification(email: string): Observable<User> {
    return this.httpClient.get<RequestResponse>(ApiEndpoints.users.getByEmailForVerification(email)).pipe(
      switchMap(response => response.result === "success" ? of(response.data) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }

  resetPassword(email: string): Observable<RequestResponse> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.users.resetPassword(), email).pipe(
      switchMap(response => response.result === "success" ? of(response) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }

  verifyResetPasswordToken(token: string): Observable<RequestResponse> {
    return this.httpClient.get<RequestResponse>(ApiEndpoints.users.verifyResetPasswordToken(token)).pipe(
      switchMap(response => response.result === "success" ? of(response) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }

  updatePassword(payload: { email: string, password: string }): Observable<RequestResponse> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.users.updatePassword(), payload).pipe(
      switchMap(response => response.result === "success" ? of(response) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }

  changeEmail(payload: { email: string, newEmail: string }): Observable<RequestResponse> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.users.changeEmail(), payload).pipe(
      switchMap(response => response.result === "success" ? of(response) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }
}

@Injectable({
  providedIn: 'root'
})
class UserHelperService {

  userCurrentLocation: Address = JSON.parse(localStorage.getItem('userCurrentLocation') as string);

  /**
   * Check the user settings for any warnings
   * @param user The user to check
   * @returns The user with any warnings
   */
  CheckUserSettings(user: User): User {
    let warnings: string[] = [];
    // 1. Check if the user is verified, if not, add a warning and include link to verify
    if (!user.settings.verified) {
      warnings.push("Your email is not verified. <br> Please verify your email to continue using the platform. <a href='dashboard/settings/verifyOTP?resendOTP=true'>Resend verification email</a>");
    }

    // 2. Check if the user has activated 2FA, if not, add a warning
    // if (!user.settings.securityTwoFactorAuth) {
    //   warnings.push("You have not activated two-factor authentication. <br> Please activate two-factor authentication to secure your account.");
    // }

    // 3. Check if the user has disabled email notifications, if not, add a warning
    if (!user.settings.notificationsEmail) {
      warnings.push("You have disabled email notifications. <br> Please enable email notifications to receive important updates.");
    }

    // 4. Check if the user's current location is available for the service
    if (this.userCurrentLocation) {
      const allowedRegions: Region[] = [{ name: 'Russia', code: 'rus', }];

      const location = this.userCurrentLocation;
      const isAllowed = allowedRegions.some(region => location.country.toLowerCase().includes(region.code.toLowerCase()));

      if (!isAllowed) {
        warnings.push('Service is not available in your current location.');
      }
    }

    return { ...user, warnings };
  }
}
