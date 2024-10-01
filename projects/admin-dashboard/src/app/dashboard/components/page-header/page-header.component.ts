import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';

@Component({
  selector: 'admin-app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() pageTitle: string = '';

  get breadcrumbs(): { title: string, link: string, active: boolean }[] {
    return this.breadcrumbService.breadcrumbs;
  }

  constructor(private breadcrumbService: BreadcrumbService) {}

}
