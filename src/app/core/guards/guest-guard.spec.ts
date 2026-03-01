import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { guestGuard } from './guest-guard';

describe('GuestGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: router }
      ]
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('Given the guard is being activated', () => {
    describe('When the user is authenticated', () => {
      it('Then it should navigate to /transport and return false', () => {
        authServiceSpy.isAuthenticated.and.returnValue(true);
        const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
        expect(result).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/transport']);
      });
    });

    describe('When the user is NOT authenticated', () => {
      it('Then it should return true', () => {
        authServiceSpy.isAuthenticated.and.returnValue(false);
        const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
        expect(result).toBeTrue();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
