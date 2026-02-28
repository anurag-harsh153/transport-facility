import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      catchError((error: HttpErrorResponse) => {

        switch (error.status) {

          case 0:
            console.error('Network error or server down');
            break;

          case 401:
            console.error('Unauthorized access');
            this.router.navigate(['/auth/login']);
            break;

          case 403:
            console.error('Forbidden');
            break;

          case 404:
            console.error('Resource not found');
            break;

          case 500:
            console.error('Internal server error');
            break;

          default:
            console.error('Unexpected error occurred');
        }

        return throwError(() => error);
      })
    );
  }
}