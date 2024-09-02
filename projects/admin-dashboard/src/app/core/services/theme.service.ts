import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-preference';
  private isDarkMode: boolean;

  constructor() {
    // Default to light mode if no preference is stored
    this.isDarkMode = localStorage.getItem(this.THEME_KEY) === 'dark';
    this.updateTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(this.THEME_KEY, this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme() {
    const theme = this.isDarkMode ? 'dark-theme' : 'light-theme';
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(theme);
  }

  isDarkTheme(): boolean {
    return this.isDarkMode;
  }
}
