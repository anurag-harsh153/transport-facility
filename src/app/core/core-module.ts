import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpErrorInterceptor } from './/interceptors/http-error-interceptor';
import { GlobalErrorHandler } from './handlers/global-error.handler';
import { APP_CONFIG } from './tokens/app-config.token';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: APP_CONFIG,
      useValue: {
        apiBaseUrl: 'http://localhost:3000'
      }
    }
  ]
})
export class CoreModule {}