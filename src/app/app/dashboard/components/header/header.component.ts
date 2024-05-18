import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/user.interface';

@Component({
  selector: 'footiedrop-web-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: User = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  currentPage: string = '';

  constructor(
    private router: Router
  ) {
    router.events.subscribe(val => {
      this.currentPage = this.router.url.endsWith('/dashboard') ? '' : this.router.url.split('/')[2];
    })
  }
}
