import { InjectionToken } from '@angular/core';

/**
 * URL base de la API REST. Se provee una sola vez en app.config.ts a partir de
 * environment.*, de modo que los servicios no dependen del archivo de entorno
 * (inversión de dependencias) y las pruebas pueden proveer otro valor.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
