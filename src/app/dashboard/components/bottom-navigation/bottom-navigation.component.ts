import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';

@Component({
  selector: 'footiedrop-web-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss']
})
export class BottomNavigationComponent {
  get user(): User { return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null };
  @Input() currentPage: string = '';
}
