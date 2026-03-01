import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorInterceptor } from './http-error-interceptor';
import { NotificationService } from '../services/notification.service';

describe('HttpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let router: Router;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Given an HTTP request is made', () => {
    describe('When a 401 Unauthorized error occurs', () => {
      it('Then it should show a notification and navigate to login', () => {
        const navigateSpy = spyOn(router, 'navigate');
        
        httpClient.get('api/data').subscribe({
          error: (err: HttpErrorResponse) => {
            expect(err.status).toBe(401);
          }
        });

        const req = httpMock.expectOne('api/data');
        req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Unauthorized access');
        expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
      });
    });

    describe('When a 404 Not Found error occurs', () => {
      it('Then it should show a resource not found notification', () => {
        httpClient.get('api/data').subscribe({
          error: (err: HttpErrorResponse) => {
            expect(err.status).toBe(404);
          }
        });

        const req = httpMock.expectOne('api/data');
        req.flush('Not Found', { status: 404, statusText: 'Not Found' });

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Resource not found');
      });
    });

    describe('When a 500 Internal Server error occurs', () => {
      it('Then it should show an internal server error notification', () => {
        httpClient.get('api/data').subscribe({
          error: (err: HttpErrorResponse) => {
            expect(err.status).toBe(500);
          }
        });

        const req = httpMock.expectOne('api/data');
        req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Internal server error');
      });
    });

    describe('When a network error occurs (status 0)', () => {
      it('Then it should show a network error notification', () => {
        httpClient.get('api/data').subscribe({
          error: (err: HttpErrorResponse) => {
            expect(err.status).toBe(0);
          }
        });

        const req = httpMock.expectOne('api/data');
        req.error(new ProgressEvent('error'));

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Network error or server down');
      });
    });
  });
});
