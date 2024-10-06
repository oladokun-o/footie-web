import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class HttpLoadingInterceptor implements HttpInterceptor {
  urlsToIntercept = [];

  urlToIngnore = [];

  constructor(private loading: LoadingService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const toIngnore = this.urlToIngnore.find(url => req.url.includes(url));
    if (!toIngnore) {
      this.loading.loading$.next(true);
    }
    return next.handle(req).pipe(
      tap(() => {
        const found = this.urlsToIntercept.find(url => req.url.includes(url))
        if (found) {
          this.loading.loading$.next(false);
        }
      })
    )
  }


}
