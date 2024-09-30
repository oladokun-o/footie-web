import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, of, throwError, catchError, forkJoin, concatMap } from 'rxjs';
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

  uploadDocument(file: any, userId: string, fileField: 'internationalPassport' | 'schoolID' | 'selfie'): Observable<RequestResponse> {
    return this.httpClient
      .post<RequestResponse>(ApiEndpoints.users.kyc.uploadDocument(userId, fileField), file)
      .pipe(
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response)
        ),
        catchError((error) => throwError(error.error))
      );
  }

  verifyKYCDocuments(userId: string): Observable<RequestResponse> {
    return this.httpClient
      .patch<RequestResponse>(ApiEndpoints.users.kyc.verifyKYCDocuments(userId), {})
      .pipe(
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response)
        ),
        catchError((error) => throwError(error))
      );
  }

  submitKYC(userId: string, formData: any): Observable<RequestResponse> {
    console.log('formData', formData);
    // Check if all required documents are present
    if (!formData.internationalPassport || !formData.schoolID || !formData.selfie) {
      return throwError({ result: 'error', message: 'All documents are required' });
    }

    const internationalPassportFormData = new FormData();
    internationalPassportFormData.append('file', formData.internationalPassport);

    const schoolIDFormData = new FormData();
    schoolIDFormData.append('file', formData.schoolID);

    const selfieFormData = new FormData();
    selfieFormData.append('file', formData.selfie);

    // Start with uploading the international passport, then schoolID, and lastly selfie
    return this.uploadDocument(internationalPassportFormData, userId, 'internationalPassport').pipe(
      // Once the international passport upload is complete, upload the school ID
      concatMap((passportResponse) => {
        if (passportResponse.result !== 'success') {
          return throwError({ result: 'error', message: 'International Passport upload failed' });
        }
        return this.uploadDocument(schoolIDFormData, userId, 'schoolID');
      }),
      // Once the school ID upload is complete, upload the selfie
      concatMap((schoolIDResponse) => {
        if (schoolIDResponse.result !== 'success') {
          return throwError({ result: 'error', message: 'School ID upload failed' });
        }
        return this.uploadDocument(selfieFormData, userId, 'selfie');
      }),
      // Once the selfie upload is complete, verify the KYC documents
      concatMap((selfieResponse) => {
        if (selfieResponse.result !== 'success') {
          return throwError({ result: 'error', message: 'Selfie upload failed' });
        }
        return this.verifyKYCDocuments(userId);
      }),
      catchError((error) => throwError(error))
    );
  }

  listKYCRecords(): Observable<RequestResponse> {
    return this.httpClient
      .get<RequestResponse>(ApiEndpoints.users.kyc.list())
      .pipe(
        switchMap((response) =>
          response.result === 'success'
            ? of(response)
            : throwError(response)
        ),
        catchError((error) => throwError(error))
      );
  }
}
