import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';
import { APP_CONFIG } from './tokens/app-config.token';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: APP_CONFIG,
      useValue: {
        apiBaseUrl: 'api'
      }
    }
  ]
})
export class CoreModule {}