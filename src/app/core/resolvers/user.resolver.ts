import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service'; // Adjust the path as needed
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Resolve } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { KycService } from '../services/kyc.service';

@Injectable({
  providedIn: 'root'
})
export class KYCUserResolver implements Resolve<User | null> {

  constructor(private kycService: KycService) { }

  private get userData(): { email: string; userId: string } | null {
    return JSON.parse(localStorage.getItem('userSessionData') as string) || null;
  }

  private get user(): User | null {
    return JSON.parse(localStorage.getItem('user') as string) || null;
  }

  resolve(): Observable<User | null> {
    const cachedUser = this.user;
    if (cachedUser) {
      // Return cached user data
      return of(cachedUser);
    }

    const sessionData = this.userData;
    if (!sessionData) {
      // No user data available, return null
      return of(null);
    }

    // Fetch user data from API
    return this.kycService.getUserByEmailForVerification(sessionData.email).pipe(
      map((user: User) => user),
      catchError(() => of(null)) // Handle error and return null
    );
  }
}
