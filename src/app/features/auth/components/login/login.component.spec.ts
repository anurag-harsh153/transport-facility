import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Given the login page is loaded', () => {
    describe('When the form is initialized', () => {
      it('Then the form should be invalid by default', () => {
        expect(component.loginForm.valid).toBeFalse();
      });
    });

    describe('When the form is submitted with valid credentials', () => {
      it('Then it should call authService.login and navigate to /transport', () => {
        const navigateSpy = spyOn(router, 'navigate');
        authServiceSpy.login.and.returnValue(of({}));
        
        component.loginForm.controls['username'].setValue('admin');
        component.loginForm.controls['password'].setValue('password');
        component.onSubmit();

        expect(authServiceSpy.login).toHaveBeenCalledWith('admin', 'password');
        expect(navigateSpy).toHaveBeenCalledWith(['/transport']);
      });
    });

    describe('When the form is submitted with invalid credentials', () => {
      it('Then it should call authService.login and show an error notification', () => {
        const errorRes = { error: { message: 'Invalid credentials' } };
        authServiceSpy.login.and.returnValue(throwError(() => errorRes));

        component.loginForm.controls['username'].setValue('user');
        component.loginForm.controls['password'].setValue('wrong-password');
        component.onSubmit();

        expect(authServiceSpy.login).toHaveBeenCalled();
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Invalid credentials');
      });
    });

    describe('When the form is invalid', () => {
      it('Then onSubmit should return without calling authService.login', () => {
        component.onSubmit();
        expect(authServiceSpy.login).not.toHaveBeenCalled();
      });
    });
  });
});
