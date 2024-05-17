import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'footiedrop-web-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss']
})
export class BottomNavigationComponent {
  currentPage: string = '';

  constructor(
    private router: Router
  ) {
    router.events.subscribe(val => {
      this.currentPage = this.router.url.endsWith('/dashboard') ? '' : this.router.url.split('/')[2];
    })
  }
}
