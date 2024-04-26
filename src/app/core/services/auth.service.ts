import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRole } from '../interfaces/user.interface';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { RequestResponse } from '../interfaces/index.interface';
import { ApiEndpoints } from '../configs/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  loginByEmail(payload: { email: string, password: string, role: UserRole }): Observable<any> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.auth.login.viaEmail(), payload).pipe(
      tap(response => localStorage.setItem("token", response.data.token)),
      switchMap(response => response.result === "success" ? of(response.data) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }

  loginByPhone(payload: { phone: string, password: string, role: UserRole }): Observable<any> {
    return this.httpClient.post<RequestResponse>(ApiEndpoints.auth.login.viaPhone(), payload).pipe(
      tap(response => localStorage.setItem("token", response.data.token)),
      switchMap(response => response.result === "success" ? of(response.data) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  checkIfLoggedIn(): Observable<boolean> {
    return this.httpClient.get<RequestResponse>(ApiEndpoints.auth.login.isAuthenticated()).pipe(
      switchMap(response => response.result === "success" ? of(true) : of(false)),
      catchError(error => of(false)),
    );
  }

  logout() {
    return this.httpClient.get<RequestResponse>(ApiEndpoints.auth.login.logout()).pipe(
      tap(() => localStorage.removeItem("token")),
      switchMap(response => response.result === "success" ? of(true) : throwError(response.message)),
      catchError(error => throwError(error)),
    );
  }
}
