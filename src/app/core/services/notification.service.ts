import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'warning' | 'error' | 'success';

export interface Notification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$: Observable<Notification | null> = this.notificationSubject.asObservable();

  showNotification(message: string, type: NotificationType = 'error'): void {
    this.notificationSubject.next({ message, type });
  }

  showWarning(message: string): void {
    this.showNotification(message, 'warning');
  }

  showError(message: string): void {
    this.showNotification(message, 'error');
  }

  showSuccess(message: string): void {
    this.showNotification(message, 'success');
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}
