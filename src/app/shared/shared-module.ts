import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    HeaderComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    NotificationComponent
  ]
})
export class SharedModule { }
