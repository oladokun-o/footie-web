	import { Injectable } from '@angular/core';
	import {
		HttpRequest,
		HttpHandler,
		HttpEvent,
		HttpInterceptor,
		HttpResponse
	} from '@angular/common/http';
	import { Observable } from 'rxjs';
	import { tap } from "rxjs/operators"

	@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Define the list of domains that require authorization headers
		const authorizedDomains = ['footiedrop-web.adaptable.app'];

		// Check if the request URL matches any of the authorized domains
		const isAuthorizedDomain = authorizedDomains.some(domain => req.url.includes(domain));

		if (isAuthorizedDomain) {
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
							window.location.href = '/login';
						}
					}
				})
			);
		}

		// If the request URL doesn't match any authorized domain, pass the request through without modification
		return next.handle(req);
	}
}

