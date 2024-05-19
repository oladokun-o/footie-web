import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/core/interfaces/user.interface';

@Component({
  selector: 'footiedrop-web-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: User = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  @Input() currentPage: string = '';
  @Input() hideProfileIcon: boolean = false;
  @Input() innerPage: string = '';

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  sanitizePageName(page: string): string {
    return this.sanitizer.bypassSecurityTrustHtml(page) as string;
  }
}
