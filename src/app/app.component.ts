import { Component } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { OnlineStatusType, OnlineStatusService } from 'ngx-online-status';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'footiedrop-web';
  status!: OnlineStatusType;
  loading: boolean;

  constructor(
    private toastr: ToastrService,
    private onlineStatusService: OnlineStatusService,
    private router: Router,
    private authService: AuthService,
  ) {
    // check if user is already logged in
    this.checkIfUserIsLoggedIn();

    toastr.toastrConfig.preventDuplicates = true;
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      // Retrieve Online status Type
      this.status = status;
      if (status === 0) toastr.error('', 'You are offline!', { disableTimeOut: true });
      else {
        toastr.toastrConfig.preventDuplicates = true;
        toastr.remove(toastr.currentlyActive);
        toastr.success('', 'You are online!', { timeOut: 2500 });
      }
    });

    this.loading = false;
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
      }
    });
  }

  checkIfUserIsLoggedIn() {
    this.authService.checkIfLoggedIn().subscribe(
      response => {
        if (response) {
          // this.toastr.info('You are already logged in.');
          this.router.navigate(['/dashboard']);
        }
      },
      error => {
        this.toastr.error('An error occurred while checking if user is logged in. Please try again later.');
      }
    );
  }
}
