import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { NotificationComponent } from './notification.component';
import { NotificationService, Notification } from '../../../core/services/notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let notificationSubject: BehaviorSubject<Notification | null>;

  beforeEach(async () => {
    notificationSubject = new BehaviorSubject<Notification | null>(null);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['clear'], {
      notification$: notificationSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      providers: [
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    fixture.detectChanges();
  });

  describe('Given the notification component is loaded', () => {
    describe('When a new notification arrives', () => {
      it('Then it should display the notification message', () => {
        const testNotification: Notification = { message: 'Test Error', type: 'error' };
        notificationSubject.next(testNotification);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.message')?.textContent).toContain('Test Error');
        expect(compiled.querySelector('.notification-container')?.classList).toContain('error');
      });

      it('Then it should automatically clear after 5 seconds', fakeAsync(() => {
        notificationSubject.next({ message: 'Test Auto Clear', type: 'success' });
        fixture.detectChanges();
        tick(5000);
        expect(notificationServiceSpy.clear).toHaveBeenCalled();
      }));
    });

    describe('When the close button is clicked', () => {
      it('Then it should call notificationService.clear', () => {
        notificationSubject.next({ message: 'Test Close', type: 'warning' });
        fixture.detectChanges();
        component.clear();
        expect(notificationServiceSpy.clear).toHaveBeenCalled();
      });
    });
  });
});
