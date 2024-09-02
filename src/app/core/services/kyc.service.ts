import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, of, throwError, catchError } from 'rxjs';
import { ApiEndpoints } from '../configs/api.config';
import { RequestResponse } from '../interfaces/index.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class KycService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  initiateKYC(userId: string): Observable<RequestResponse> {
    return this.httpClient
      .get<RequestResponse>(ApiEndpoints.users.kyc.initiateKYC(userId))
      .pipe(
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response)
        ),
        catchError((error) => throwError(error))
      );
  }

  getUserByEmailForVerification(email: string): Observable<User> {
    return this.httpClient
      .get<RequestResponse>(ApiEndpoints.users.kyc.getUserByEmailForKYC(email))
      .pipe(
        switchMap((response) =>
          response.result === 'success'
            ? of(response.data)
            : throwError(response)
        ),
        catchError((error) => throwError(error))
      );
  }

  getUserByIDForVerification(email: string): Observable<User> {
    return this.httpClient
      .get<RequestResponse>(ApiEndpoints.users.kyc.getUserByIDForKYC(email))
      .pipe(
        switchMap((response) =>
          response.result === 'success'
            ? of(response.data)
            : throwError(response)
        ),
        catchError((error) => throwError(error))
      );
  }
}
