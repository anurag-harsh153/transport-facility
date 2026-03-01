import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Given the header is loaded', () => {
    describe('When the component is initialized', () => {
      it('Then it should check authentication status', () => {
        authServiceSpy.isAuthenticated.and.returnValue(true);
        component.ngOnInit();
        expect(component.isLoggedIn).toBeTrue();
      });
    });

    describe('When the user logs out', () => {
      it('Then it should call authService.logout', () => {
        component.logout();
        expect(authServiceSpy.logout).toHaveBeenCalled();
      });
    });
  });
});
