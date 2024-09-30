import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() pageTitle: string = '';

  @Input() breadcrumbs: { title: string, link: string, active: boolean }[] = [];
}
