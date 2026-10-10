import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from '../core/api-base-url.token';

/** Proveedores mínimos para instanciar componentes en pruebas (sin red real). */
export const PROVIDERS_PRUEBA: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  { provide: API_BASE_URL, useValue: 'http://api.test' },
];
