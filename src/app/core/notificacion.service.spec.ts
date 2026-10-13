import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Swal from 'sweetalert2';
import { NotificacionService } from './notificacion.service';

describe('NotificacionService', () => {
  let servicio: NotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(NotificacionService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('exito muestra un aviso de éxito que se cierra solo', async () => {
    const espia = vi.spyOn(Swal, 'fire').mockResolvedValue({} as never);
    await servicio.exito('Guardado');
    expect(espia).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success', title: 'Guardado', showConfirmButton: false }));
  });

  it('error muestra un aviso de error', async () => {
    const espia = vi.spyOn(Swal, 'fire').mockResolvedValue({} as never);
    await servicio.error('Falló');
    expect(espia).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', title: 'Falló' }));
  });

  it('confirmar devuelve true cuando la persona acepta', async () => {
    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true } as never);
    expect(await servicio.confirmar('¿Eliminar?')).toBe(true);
  });

  it('confirmar devuelve false cuando la persona cancela', async () => {
    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: false } as never);
    expect(await servicio.confirmar('¿Eliminar?')).toBe(false);
  });
});
