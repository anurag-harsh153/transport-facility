import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: AuthService, useValue: authSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Given an HTTP request is made', () => {
    describe('When the user is logged in and the URL is for the API', () => {
      it('Then it should add the Authorization header', () => {
        authServiceSpy.getToken.and.returnValue('fake-token');

        httpClient.get('api/data').subscribe();

        const req = httpMock.expectOne('api/data');
        expect(req.request.headers.has('Authorization')).toBeTrue();
        expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
      });
    });

    describe('When the user is NOT logged in', () => {
      it('Then it should NOT add the Authorization header', () => {
        authServiceSpy.getToken.and.returnValue(null);

        httpClient.get('api/data').subscribe();

        const req = httpMock.expectOne('api/data');
        expect(req.request.headers.has('Authorization')).toBeFalse();
      });
    });

    describe('When the URL is NOT for the API', () => {
      it('Then it should NOT add the Authorization header', () => {
        authServiceSpy.getToken.and.returnValue('fake-token');

        httpClient.get('assets/config.json').subscribe();

        const req = httpMock.expectOne('assets/config.json');
        expect(req.request.headers.has('Authorization')).toBeFalse();
      });
    });
  });
});
