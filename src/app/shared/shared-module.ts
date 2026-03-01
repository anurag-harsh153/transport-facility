import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    NotificationComponent,
    ModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    NotificationComponent,
    ModalComponent
  ]
})
export class SharedModule { }
