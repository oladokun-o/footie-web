import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'footiedrop-web-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // hide menu on some pages
  hideMenu = false;

  constructor(
    private router: Router
  ) {
    // create an array of routes where the menu should be hidden
    const routesToHideMenu = ['/changeEmail', '/verifyOTP'];
    // check if the current route is in the array
    this.hideMenu = routesToHideMenu.includes(router.url);
  }

}
