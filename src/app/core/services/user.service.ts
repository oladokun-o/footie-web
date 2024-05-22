import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestResponse } from '../interfaces/index.interface';
import { CreateUserDto } from '../dto/user.dto';
import { Observable, tap, switchMap, of, throwError, catchError } from 'rxjs';
import { ApiEndpoints } from '../configs/api.config';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

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
      switchMap(response => response.result === "success" ? of(response.data) : throwError(response.message)),
      catchError(error => throwError(error.error)),
    );
  }

  resendOtp(email: string): Observable<any> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.users.resendOtp(), email).pipe(
      switchMap(response => response.result === "success" ? of(response.data) : throwError(response.message)),
      catchError(error => throwError(error.error)),
    );
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<RequestResponse>(ApiEndpoints.users.getById(id)).pipe(
      switchMap(response => response.result === "success" ? of(response.data) : throwError(response.message)),
      catchError(error => throwError(error.error)),
    );
  }

  getUserByEmail(email: string): Observable<User> {
    return this.httpClient.get<RequestResponse>(ApiEndpoints.users.getByEmail(email)).pipe(
      switchMap(response => response.result === "success" ? of(response.data) : throwError(response.message)),
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
