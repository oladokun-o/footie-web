import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'projects/admin-dashboard/src/app/core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.checkIfLoggedIn().pipe(
      map(isAuthenticated => {
        console.log(isAuthenticated)
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
          return false; // Prevent access to the login page
        }
        return true; // Allow access to the login page
      })
    );
  }
}
