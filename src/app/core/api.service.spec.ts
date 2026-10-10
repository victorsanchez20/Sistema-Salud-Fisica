import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { API_BASE_URL } from './api-base-url.token';
import { TurnoService } from '../services/turno.service';
import { DoctorService } from '../services/doctor.service';
import { HorarioService } from '../services/horario.service';

describe('Servicios HTTP (ApiService / CrudApiService)', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test' },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('CrudApiService construye la URL con la base inyectada (leer)', () => {
    TestBed.inject(TurnoService).leer().subscribe();
    const req = http.expectOne('http://api.test/api/terapia/turno');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('CrudApiService actualiza y elimina por id', () => {
    const doctores = TestBed.inject(DoctorService);

    doctores.actualizar(7, { nombre: 'Dr. Perez', estado: 'Activo' }).subscribe();
    const put = http.expectOne('http://api.test/api/terapia/doctor/7');
    expect(put.request.method).toBe('PUT');
    put.flush({});

    doctores.eliminar(7).subscribe();
    const del = http.expectOne('http://api.test/api/terapia/doctor/7');
    expect(del.request.method).toBe('DELETE');
    del.flush({});
  });

  it('las operaciones propias del recurso reutilizan la misma base', () => {
    TestBed.inject(HorarioService).obtenerHorasDisponibles(3, '2026-10-12').subscribe();
    const req = http.expectOne(r => r.url === 'http://api.test/horarios/horas-disponibles');
    expect(req.request.params.get('doctorId')).toBe('3');
    expect(req.request.params.get('fecha')).toBe('2026-10-12');
    req.flush([]);
  });
});
