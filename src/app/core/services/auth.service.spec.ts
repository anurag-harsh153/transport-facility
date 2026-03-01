import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { APP_CONFIG } from '../tokens/app-config.token';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: APP_CONFIG, useValue: { apiBaseUrl: 'api' } }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Given the user attempts to login', () => {
    describe('When valid credentials are provided', () => {
      it('Then it should store the token and employeeId and return the response', () => {
        const mockResponse = { token: 'fake-token', employeeId: '123' };
        service.login('user', 'pass').subscribe(res => {
          expect(res).toEqual(mockResponse);
          expect(sessionStorage.getItem('auth_token')).toBe('fake-token');
          expect(sessionStorage.getItem('auth_employee_id')).toBe('123');
        });

        const req = httpMock.expectOne('api/login');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
      });
    });
  });

  describe('Given the user is logged in', () => {
    beforeEach(() => {
      sessionStorage.setItem('auth_token', 'fake-token');
      sessionStorage.setItem('auth_employee_id', '123');
    });

    describe('When logout is called', () => {
      it('Then it should clear session storage and navigate to login', () => {
        const navigateSpy = spyOn(router, 'navigate');
        service.logout();
        expect(sessionStorage.getItem('auth_token')).toBeNull();
        expect(sessionStorage.getItem('auth_employee_id')).toBeNull();
        expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
      });
    });

    describe('When checking authentication status', () => {
      it('Then isAuthenticated should return true', () => {
        expect(service.isAuthenticated()).toBeTrue();
      });
    });

    describe('When getting the token', () => {
      it('Then it should return the stored token', () => {
        expect(service.getToken()).toBe('fake-token');
      });
    });

    describe('When getting the employeeId', () => {
      it('Then it should return the stored employeeId', () => {
        expect(service.getEmployeeId()).toBe('123');
      });
    });
  });

  describe('Given the user is not logged in', () => {
    describe('When checking authentication status', () => {
      it('Then isAuthenticated should return false', () => {
        expect(service.isAuthenticated()).toBeFalse();
      });
    });
  });
});
