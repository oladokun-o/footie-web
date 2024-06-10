import { Component } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'footiedrop-web-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.scss'],
})
export class SettingsHomeComponent {
  get user(): User {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;
  }

  isDarkMode: boolean;

  constructor(private themeService: ThemeService) {
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  getLanguage(language: string): string {
    let formattedLanugage = '';
    switch (language.toLowerCase()) {
      case 'en':
        formattedLanugage = 'English';
        break;

      case 'ru':
        formattedLanugage = 'Russian';
        break;

      case 'fr':
        formattedLanugage = 'French';
        break;

      default:
        formattedLanugage = 'English';
        break;
    }

    return formattedLanugage;
  }
}
