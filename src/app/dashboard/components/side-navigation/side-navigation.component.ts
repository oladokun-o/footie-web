import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';

@Component({
  selector: 'footiedrop-web-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent {
  get user(): User { return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null };
  @Input() currentPage: string = '';
}
