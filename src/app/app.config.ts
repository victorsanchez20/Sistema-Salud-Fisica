import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { API_BASE_URL } from './core/api-base-url.token';
import { environment } from '../environments/environment';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

//  REGISTRAR ESPAÑOL
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: API_BASE_URL, useValue: environment.api },
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]
};
