import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';

@Component({
  selector: 'footiedrop-web-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: User = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  @Input() currentPage: string = '';
}
