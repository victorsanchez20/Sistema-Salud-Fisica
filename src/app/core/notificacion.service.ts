import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/**
 * Avisos y confirmaciones al usuario.
 *
 * Reemplaza a window.alert() y window.confirm(), que bloquean la página,
 * no se pueden estilizar y se ven mal en el celular. Usa SweetAlert2, la
 * misma librería que ya usaban las demás pantallas, para que todos los
 * mensajes tengan el mismo aspecto.
 */
@Injectable({ providedIn: 'root' })
export class NotificacionService {
  exito(titulo: string): Promise<unknown> {
    return Swal.fire({ icon: 'success', title: titulo, timer: 1400, showConfirmButton: false });
  }

  error(titulo: string): Promise<unknown> {
    return Swal.fire({ icon: 'error', title: titulo });
  }

  /** Devuelve true si la persona confirma la acción. */
  async confirmar(titulo: string, detalle?: string, textoConfirmar = 'Sí, eliminar'): Promise<boolean> {
    const respuesta = await Swal.fire({
      icon: 'warning',
      title: titulo,
      text: detalle,
      showCancelButton: true,
      confirmButtonText: textoConfirmar,
      cancelButtonText: 'Cancelar',
    });
    return respuesta.isConfirmed;
  }
}
