import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  breadcrumbs: { title: string, link: string, active: boolean }[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .subscribe((event: any) => {
        if (event.routerEvent instanceof NavigationEnd) {
          const breadcrumbs = this.buildBreadcrumbs(this.route.root);
          breadcrumbs[breadcrumbs.length - 1].active = true; // Mark the last breadcrumb as active
          this.breadcrumbs = breadcrumbs;
        }
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: { title: string, link: string, active: boolean }[] = []): { title: string, link: string, active: boolean }[] {
    let children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const breadcrumbTitle = child.snapshot.data['breadcrumb'];

      if (breadcrumbTitle) {
        breadcrumbs.push({
          title: breadcrumbTitle,
          link: url,
          active: false // Mark as active only for the current page
        });
      }

      // Handle lazy-loaded routes (check if firstChild exists)
      if (child.firstChild) {
        breadcrumbs = this.buildBreadcrumbs(child.firstChild, url, breadcrumbs);
      } else {
        breadcrumbs = this.buildBreadcrumbs(child, url, breadcrumbs);
      }
    }

    return breadcrumbs;
  }

  setActiveBreadcrumb(index: number): void {
    this.breadcrumbs.forEach((crumb, i) => crumb.active = i === index);
  }

  getActiveBreadcrumb() {
    return this.breadcrumbs.find(crumb => crumb.active);
  }
}
