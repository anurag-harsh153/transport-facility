import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: Notification | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      notification => {
        this.notification = notification;
        if (notification) {
          setTimeout(() => this.clear(), 5000);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clear(): void {
    this.notificationService.clear();
  }
}
