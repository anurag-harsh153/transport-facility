import { TestBed } from '@angular/core/testing';
import { NotificationService, Notification } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  describe('Given the initial state', () => {
    describe('When the service starts', () => {
      it('Then the initial notification should be null', (done) => {
        service.notification$.subscribe(n => {
          expect(n).toBeNull();
          done();
        });
      });
    });
  });

  describe('Given a message is provided', () => {
    describe('When showWarning is called', () => {
      it('Then it should emit a warning notification', (done) => {
        const message = 'Test Warning';
        service.showWarning(message);
        service.notification$.subscribe(n => {
          if (n) {
            expect(n.message).toBe(message);
            expect(n.type).toBe('warning');
            done();
          }
        });
      });
    });

    describe('When showError is called', () => {
      it('Then it should emit an error notification', (done) => {
        const message = 'Test Error';
        service.showError(message);
        service.notification$.subscribe(n => {
          if (n) {
            expect(n.message).toBe(message);
            expect(n.type).toBe('error');
            done();
          }
        });
      });
    });

    describe('When showSuccess is called', () => {
      it('Then it should emit a success notification', (done) => {
        const message = 'Test Success';
        service.showSuccess(message);
        service.notification$.subscribe(n => {
          if (n) {
            expect(n.message).toBe(message);
            expect(n.type).toBe('success');
            done();
          }
        });
      });
    });

    describe('When clear is called', () => {
      it('Then it should emit null', (done) => {
        service.showSuccess('Test');
        service.clear();
        service.notification$.subscribe(n => {
          expect(n).toBeNull();
          done();
        });
      });
    });
  });
});
