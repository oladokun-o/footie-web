import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/interfaces/user.interface';
import { NavbarService } from '../../../core/services/navbar.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'admin-app-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  languageOptions: { code: string; name: string }[] = [
    { code: 'ENG', name: 'English' },
  ];
  selectedLanguage = 'ENG';
  user: User | null = JSON.parse(localStorage.getItem('user') as string);
  notifications: { title: string; message: string, id: string }[] = [];
  get notificationsCount(): number {
    return this.notifications.length;
  }

  isVisible: boolean;
  private readonly localStorageKey = 'navbarVisible';

  constructor(
    private navbarService: NavbarService,
    private deviceService: DeviceDetectorService,
  ) {
    const storedVisibility = localStorage.getItem(this.localStorageKey);
    const isVisible = storedVisibility === 'true';
    this.isVisible = isVisible;
  }

  ngOnInit(): void {
    this.checkDevice();
  }

  toggleNavbar() {
    this.navbarService.toggleNavbar();

    const isDesktop = this.deviceService.isDesktop();

    if (!isDesktop) {
      document.body.classList.remove('mini-sidebar');
    }
  }

  isMobile: boolean = false;
  isTablet: boolean = false;

  checkDevice(): void {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    if (this.isMobile || this.isTablet) {
      this.navbarService.hideNavbar();
      // if mobile or tablet, add twocolumn-panel class to body
      document.body.classList.add('twocolumn-panel');
      document.body.classList.remove('mini-sidebar');
    } else {
      // if desktop, remove twocolumn-panel class from body
      document.body.classList.remove('twocolumn-panel');
    }
  }
}
