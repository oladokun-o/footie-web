import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<{ title: string, link: string, active: boolean }[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const breadcrumbs = this.buildBreadcrumbs(this.route.root);
        if (breadcrumbs.length) {
          breadcrumbs[breadcrumbs.length - 1].active = true; // Mark the last breadcrumb as active
        }
        this.breadcrumbsSubject.next(breadcrumbs); // Emit new breadcrumbs
      }
    });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: { title: string, link: string, active: boolean }[] = [], titles: Set<string> = new Set()): { title: string, link: string, active: boolean }[] {
    let children: ActivatedRoute[] = route.children;

    let breadCrumbTitles = breadcrumbs.map(breadcrumb => breadcrumb.title);
    titles = new Set(breadCrumbTitles);

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Append ID to breadcrumb link if it exists
      const id = child.snapshot.params['id'];
      const breadcrumbTitle = child.snapshot.data['breadcrumb'];

      if (breadcrumbTitle && !titles.has(breadcrumbTitle)) {
        titles.add(breadcrumbTitle);
        breadcrumbs.push({
          title: breadcrumbTitle,
          link: url + (id ? `/${id}` : ''), // Append ID to the link if it exists
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

  getActiveBreadcrumb() {
    return this.breadcrumbsSubject.getValue().find(crumb => crumb.active);
  }
}
