import { Component } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, NavigationStart, Router } from '@angular/router';
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
  innerPage: string = '';
  loading: boolean;
  fadeOut: boolean;

  hideBottomNav: boolean = false;
  hideProfileIcon: boolean = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    document.body.classList.add('dashboard-body');
    this.loading = true;
    this.fadeOut = false;
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.fadeOut = true;
          this.loading = false;
        }, 1000);

        this.currentPage = this.router.url.endsWith('/dashboard') ? '' : this.router.url.split('/')[2];
        this.innerPage = '';
        this.hideBottomNav = false;
        this.hideProfileIcon = false;
        // make sure to exclude params from the url
        if (this.currentPage && this.currentPage.includes('?')) {
          this.currentPage = this.currentPage.split('?')[0];
        };

        // check if id, if it does, show currentPage as "View {{currentPage}}", set currentPage as a singular form
        if (event.url.split('/').length > 3) {
          this.innerPage = event.url.split('/')[2];
          if (this.innerPage.includes('s')) {
            this.innerPage = this.innerPage.slice(0, -1);
          }
          this.innerPage = `
          <a onclick="window.history.back()" style="cursor: pointer;">
            <svg width="14" height="26" viewBox="0 0 14 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.999 0L0 13L11.999 26L14 23.8336L3.99919 13L14 2.16641L11.999 0Z" fill="#01674F"/>
            </svg>
          </a>
          View ${this.innerPage}
          `;
          this.hideBottomNav = true;
          this.hideProfileIcon = true;
        }

        // check if url contains /new, if it does, show currentPage as "Create {{currentPage}}", set currentPage as a singular form
        // Also add the back button to the innerPage with the svg icon
        // Also check if a query param type is present, if it is, show currentPage as "Create {{type}} {{currentPage}}", set currentPage as a singular form
        if (event.url.split('/').length > 3 && event.url.includes('/new')) {
          this.innerPage = event.url.split('/')[2];
          if (this.innerPage.includes('s')) {
            this.innerPage = this.innerPage.slice(0, -1);
          }

          if (event.url.includes('type')) {
            this.innerPage = `
            <a onclick="window.history.back()" style="cursor: pointer;">
              <svg width="14" height="26" viewBox="0 0 14 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.999 0L0 13L11.999 26L14 23.8336L3.99919 13L14 2.16641L11.999 0Z" fill="#01674F"/>
              </svg>
            </a>
            Create ${this.activatedRoute.snapshot.queryParams['type']} ${this.innerPage}
            `;
          } else {
            this.innerPage = `
            <a onclick="window.history.back()" style="cursor: pointer;">
              <svg width="14" height="26" viewBox="0 0 14 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.999 0L0 13L11.999 26L14 23.8336L3.99919 13L14 2.16641L11.999 0Z" fill="#01674F"/>
              </svg>
            </a>
            Create ${this.innerPage}
            `;
          }
        }
      }
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
