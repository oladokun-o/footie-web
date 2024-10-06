import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { AuthService } from '../services/auth.service'; // Import AuthService

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService, // Inject ToastrService for notifications
    private authService: AuthService // Inject AuthService to handle logout
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('UnauthorizedInterceptor');
    console.log('req', req);
    console.log('next', next);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the error is a 401 Unauthorized
        if (error.status === 401) {
          // Show a toast message
          this.toastr.error('Session expired. Please log in again.', 'Unauthorized');

        }

        // Re-throw the error to allow further handling if necessary
        return throwError(() => error);
      })
    );
  }
}
