import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Resolve } from '@angular/router';
import { User, UserRole } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';
import { KycService } from 'projects/admin-dashboard/src/app/core/services/kyc.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> {
  constructor(
    private userService: UserService,
  ) { }

  userSession: { email: string; role: UserRole; id: string; userId: string } =
    localStorage.getItem('userSessionData')
      ? JSON.parse(localStorage.getItem('userSessionData') as string)
      : null;

  resolve(): Observable<User | null> {
    return this.userService.getUserById(this.userSession.userId).pipe(
      tap((user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
      }),
      map((user: User) => user),
      catchError(() => of(null))
    );
  }
}

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
