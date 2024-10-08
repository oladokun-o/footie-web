import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { NavbarService } from '../../../core/services/navbar.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'admin-app-side-nav',
  templateUrl: './admin-side-nav.component.html',
  styleUrls: ['./admin-side-nav.component.scss']
})
export class AdminSideNavComponent implements OnInit {
  routes: { title: string, link: string, active: boolean, icon?: string }[] = [
    { title: 'Dashboard', link: './', active: true, icon: 'dashcube' },
    { title: 'KYC Records', link: './kyc-records', active: false, icon: 'user' },
  ];
  $isVisible = this.navbarService.isVisible$;

  constructor(
    private breadCrumbService: BreadcrumbService,
    private router: Router,
    private navbarService: NavbarService,
    private deviceService: DeviceDetectorService,
  ) {
    // Listen for route changes
    this.router.events
      .subscribe((event: any) => {
        if (event.routerEvent instanceof NavigationEnd) {
          this.updateRoutes();
        }
      });
  }

  ngOnInit(): void {
    this.checkDevice();
  }

  get activeBreadcrumb() {
    return this.breadCrumbService.getActiveBreadcrumb();
  }

  updateRoutes() {
    let foundRoute = this.routes.find(route => route.title.toLowerCase() === (this.activeBreadcrumb && this.activeBreadcrumb.title)?.toLowerCase());

    if (foundRoute) {
      this.routes.forEach(route => route.active = false);
      foundRoute.active = true;
    }
  }

  hideNavbar() {
    this.navbarService.hideNavbar();
  }

  showNavbar() {
    this.navbarService.showNavbar();
  }

  toggleNavbar() {
    this.navbarService.toggleNavbar();
  }

  handleMouseOverSidebar() {
    document.body.classList.add('expand-menu');
  }

  handleMouseLeaveSidebar() {
    document.body.classList.remove('expand-menu');
  }

  handleNavItemClicked() {
    if (this.isMobile || this.isTablet) {
      this.navbarService.hideNavbar();
    }
  }

  isMobile: boolean = false;
  isTablet: boolean = false;

  checkDevice(): void {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
  }
}
