import { Component } from '@angular/core';
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

  constructor(
    private userService: UserService,
    toastr: ToastrService,
    authService: AuthService
  ) {
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
