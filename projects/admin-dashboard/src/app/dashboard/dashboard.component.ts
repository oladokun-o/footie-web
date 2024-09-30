import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User, UserRole } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';
import { AuthService } from 'projects/admin-dashboard/src/app/core/services/auth.service';
import { UserService } from 'projects/admin-dashboard/src/app/core/services/user.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'admin-app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  user: User | null = JSON.parse(localStorage.getItem('user') as string);

  userSession: { email: string; role: UserRole; id: string; userId: string } =
    localStorage.getItem('userSessionData')
      ? JSON.parse(localStorage.getItem('userSessionData') as string)
      : null;

  loading: boolean;
  pageTitle: string = this.user ? `Welcome, ${this.user.firstName}` : 'Welcome';
  breadcrumbs: { title: string, link: string, active: boolean }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.loading = true;
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loading = false;
      }

      if (event instanceof NavigationStart) {
        this.loading = true;
      }
    });

    if (this.userSession && !this.user) {
      this.loading = true;

      let id = this.userSession.id
        ? this.userSession.id
        : this.userSession.userId;

      if (id) {
        this.userService.getUserById(id).subscribe((user) => {
          this.loading = false;

          if (user) {
            this.user = user;
            this.pageTitle = `Welcome, ${user.firstName}`;
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            toastr.error('User not found! <br> please login again.');
            authService.logout();
          }
        });
      } else if (this.userSession.email) {
        this.userService
          .getUserByEmail(this.userSession.email)
          .subscribe((user) => {
            this.loading = false;

            if (user) {
              this.user = user;
              this.pageTitle = `Welcome, ${user.firstName}`;
              localStorage.setItem('user', JSON.stringify(user));
            } else {
              toastr.error('User not found! <br> please login again.');
              authService.logout();
            }
          });
      }
    }
  }

  ngOnInit(): void {

  }
}
