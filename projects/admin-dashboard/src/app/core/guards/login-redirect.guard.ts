import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'projects/admin-dashboard/src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      console.log('User is already authenticated, redirecting to dashboard');
      this.router.navigate(['/dashboard']); // Change '/dashboard' to your actual dashboard route
      return false; // Prevent access to the login page
    } else {
      console.log('User is not authenticated, can access login page');
      return true; // Allow access to the login page
    }
  }
}
