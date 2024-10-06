import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from "rxjs/operators";
import { Router } from '@angular/router'; // Import Router
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { } // Inject Router

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Define the list of domains that require authorization headers
    const authorizedDomains = ['footiedrop.adaptable.app', 'footiedrop.ru', 'localhost:3000'];

    // Check if the request URL matches any of the authorized domains
    const isAuthorizedDomain = authorizedDomains.some(domain => req.url.includes(domain));

    // Check if the request URL is for the login page
    const AuthPages = [
      '/login',
      '/register',
      '/verifyOTP',
      '/changeEmail',
      '/resetPassword',
      '/verifyPasswordResetToken',
      '/updatePassword',
      '/users',
      '/users/verify',
      '/validateToken'
    ];

    const isAuthPage = AuthPages.some(page => req.url.endsWith(page));

    if (isAuthorizedDomain && !isAuthPage) {
      // Add the authorization header for requests to authorized domains
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return next.handle(clonedRequest).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const response = event.body; // Assuming the response body contains the error message and result

            if (
              response &&
              response.result === 'error'
            ) {
              // Redirect to login page if the response indicates an expired token
              this.router.navigate(['/login']); // Use Router for redirection
            }
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (
            error &&
            error.error.result === 'error' &&
            error.error.message === 'Invalid token'
          ) {
            this.toastr.error('Session expired, please log in again.', 'Unauthorized!');
          }

          return throwError(error);
        })
      );
    }

    // If the request is for the login page, handle it normally
    return next.handle(req);
  }
}
