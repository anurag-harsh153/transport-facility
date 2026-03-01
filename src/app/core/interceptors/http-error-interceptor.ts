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
import { NotificationService } from '../services/notification.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private notificationService: NotificationService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      catchError((error: HttpErrorResponse) => {

        switch (error.status) {

          case 0:
            this.notificationService.showError('Network error or server down');
            break;

          case 401:
            this.notificationService.showError('Unauthorized access');
            this.router.navigate(['/auth/login']);
            break;

          case 403:
            this.notificationService.showError('Forbidden access');
            break;

          case 404:
            this.notificationService.showError('Resource not found');
            break;

          case 500:
            this.notificationService.showError('Internal server error');
            break;

          default:
            this.notificationService.showError('Unexpected error occurred');
        }

        return throwError(() => error);
      })
    );
  }
}