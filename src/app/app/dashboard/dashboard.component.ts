import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User, UserRole } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'footiedrop-web-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userSession: { email: string, role: UserRole } = localStorage.getItem('userSessionData') ? JSON.parse(localStorage.getItem('userSessionData') as string) : null;
  currentPage: string = '';

  constructor(
    private userService: UserService,
    toastr: ToastrService,
    authService: AuthService,
    private router: Router
  ) {
    router.events.subscribe(val => {
      this.currentPage = this.router.url.endsWith('/dashboard') ? '' : this.router.url.split('/')[2];
      // make sure to exclude params from the url
      if (this.currentPage && this.currentPage.includes('?')) {
        this.currentPage = this.currentPage.split('?')[0];
      };
    })

    this.userService.getUserByEmail(this.userSession.email).subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        toastr.error('User not found! <br> please login again.');
        authService.logout();
      }
    });
  }
}
