import { Component } from '@angular/core';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'admin-app-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {
  languageOptions: { code: string; name: string }[] = [
    { code: 'ENG', name: 'English' },
  ];
  selectedLanguage = 'ENG';
  user: User | null = JSON.parse(localStorage.getItem('user') as string);
  notifications: { title: string; message: string, id: string }[] = [];
  get notificationsCount(): number {
    return this.notifications.length;
  }
}
