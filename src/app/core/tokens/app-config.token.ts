import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<{
  apiBaseUrl: string;
}>('app.config');