import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, of, throwError, catchError, tap } from 'rxjs';
import { ApiEndpoints } from '../configs/api.config';
import { RequestResponse } from '../interfaces/index.interface';
import { User } from '../interfaces/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  get user(): User {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;
  }

  updateUser() {
    this.userService.getUserById(this.user.id).subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    });
  }

  ChangeLanguage(payload: any): Observable<RequestResponse> {
    return this.httpClient
      .post<RequestResponse>(
        ApiEndpoints.users.settings.ChangeLanguage(),
        payload
      )
      .pipe(
        tap((response) => {
          if (response.result === 'success') this.updateUser();
        }),
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response.message)
        ),
        catchError((error) => throwError(error.error))
      );
  }

  ChangePassword(payload: any): Observable<RequestResponse> {
    return this.httpClient
      .post<RequestResponse>(
        ApiEndpoints.users.settings.ChangePassword(),
        payload
      )
      .pipe(
        tap((response) => {
          if (response.result === 'success') this.updateUser();
        }),
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response.message)
        ),
        catchError((error) => throwError(error))
      );
  }

  ChangeEmail(payload: any): Observable<RequestResponse> {
    return this.httpClient
      .post<RequestResponse>(ApiEndpoints.users.settings.ChangeEmail(), payload)
      .pipe(
        tap((response) => {
          if (response.result === 'success') this.updateUser();
        }),
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response.message)
        ),
        catchError((error) => throwError(error))
      );
  }

  ChangePhoneNumber(payload: any): Observable<RequestResponse> {
    return this.httpClient
      .post<RequestResponse>(
        ApiEndpoints.users.settings.ChangePhoneNumber(),
        payload
      )
      .pipe(
        tap((response) => {
          if (response.result === 'success') this.updateUser();
        }),
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response.message)
        ),
        catchError((error) => throwError(error.error))
      );
  }

  UpdateAddress(payload: any): Observable<RequestResponse> {
    return this.httpClient
      .post<RequestResponse>(
        ApiEndpoints.users.settings.UpdateAddress(),
        payload
      )
      .pipe(
        tap((response) => {
          if (response.result === 'success') this.updateUser();
        }),
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response.message)
        ),
        catchError((error) => throwError(error.error))
      );
  }

  UpdateCommunicationPreferences(payload: any): Observable<RequestResponse> {
    return this.httpClient
      .post<RequestResponse>(
        ApiEndpoints.users.settings.UpdateCommunicationPreference(),
        payload
      )
      .pipe(
        tap((response) => {
          if (response.result === 'success') this.updateUser();
        }),
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response.message)
        ),
        catchError((error) => throwError(error.error))
      );
  }

  UpdateProfile(payload: any): Observable<RequestResponse> {
    const formData = this.toFormData(payload);

    return this.httpClient
      .post<RequestResponse>(
        ApiEndpoints.users.settings.UpdateProfile(this.user.id),
        formData
      )
      .pipe(
        tap((response) => {
          if (response.result === 'success') this.updateUser();
        }),
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response.message)
        ),
        catchError((error) => throwError(error.error))
      );
  }

  private toFormData(obj: any): FormData {
    const formData = new FormData();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key]);
      }
    }
    return formData;
  }
}
