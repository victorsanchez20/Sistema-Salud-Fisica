import { Injectable, isDevMode } from '@angular/core';

/**
 * Punto único de registro (log) de la aplicación.
 *
 * Antes cada página llamaba a console.log / console.error directamente y
 * mostraba en la consola del navegador datos de pacientes (formularios,
 * respuestas del servidor). Ahora:
 *  - `warn` y `error` muestran el detalle completo solo en desarrollo; en
 *    producción solo escriben el mensaje, sin el objeto de error.
 *  - Si algún día se envían los errores a un servicio externo, se cambia
 *    solo esta clase.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  warn(mensaje: string, detalle?: unknown): void {
    if (isDevMode() && detalle !== undefined) {
      console.warn(mensaje, detalle);
    } else {
      console.warn(mensaje);
    }
  }

  error(mensaje: string, detalle?: unknown): void {
    if (isDevMode() && detalle !== undefined) {
      console.error(mensaje, detalle);
    } else {
      console.error(mensaje);
    }
  }
}
