import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './core/mock/in-memory-data.service';
import { APP_CONFIG } from './core/tokens/app-config.token';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService,
      { delay: 500 }
    ),
    CoreModule
  ],
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        apiBaseUrl: 'api'
      }
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
