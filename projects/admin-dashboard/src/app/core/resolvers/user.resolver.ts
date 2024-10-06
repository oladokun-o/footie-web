import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Resolve } from '@angular/router';
import { User, UserRole } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> {
  private userSession: { email: string; role: UserRole; id: string; userId: string } | null;

  constructor(private userService: UserService) {
    this.userSession = this.getUserSession();
  }

  /**
   * Retrieves the user session data from localStorage.
   */
  private getUserSession(): { email: string; role: UserRole; id: string; userId: string } | null {
    const sessionData = localStorage.getItem('userSessionData');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  /**
   * Save the user to localStorage
   * @param user - The user object to store
   */
  private saveUserToLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Fetch user details based on available session properties.
   */
  private fetchUser(): Observable<User | null> {
    if (!this.userSession) {
      return of(null);
    }

    if (this.userSession.userId) {
      return this.userService.getUserById(this.userSession.userId);
    } else if (this.userSession.id) {
      return this.userService.getUserById(this.userSession.id);
    } else if (this.userSession.email) {
      return this.userService.getUserByEmail(this.userSession.email);
    }

    return of(null);
  }

  /**
   * Resolver logic for retrieving the user and handling storage.
   */
  resolve(): Observable<User | null> {
    if (!this.userSession) {
      return of(null); // Early return if no user session
    }

    return this.fetchUser().pipe(
      tap((user) => {
        if (user) {
          this.saveUserToLocalStorage(user);
        }
      }),
      catchError(() => of(null)) // Handle errors by returning null
    );
  }
}
