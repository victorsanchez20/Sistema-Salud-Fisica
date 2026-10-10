import { describe, it, expect } from 'vitest';
import { construirMes, diasVaciosAntesDelPrimero, cantidadDiasDelMes, formatearFechaIso } from './calendario.util';
import { construirPayloadCita } from './cita-payload.util';
import { filtrarHorasPorTurno } from '../config/turnos.config';

describe('calendario.util', () => {
  it('octubre 2026 empieza en jueves (3 celdas vacías) y tiene 31 días', () => {
    expect(diasVaciosAntesDelPrimero(2026, 9)).toBe(3);
    expect(cantidadDiasDelMes(2026, 9)).toBe(31);
  });

  it('un mes que empieza en domingo deja 6 vacíos (semana Lun–Dom)', () => {
    // febrero 2026 empieza en domingo
    expect(diasVaciosAntesDelPrimero(2026, 1)).toBe(6);
    expect(cantidadDiasDelMes(2026, 1)).toBe(28);
  });

  it('construirMes usa las fábricas de cada pantalla', () => {
    const grilla = construirMes(2026, 9, () => 0, d => d);
    expect(grilla.length).toBe(3 + 31);
    expect(grilla.slice(0, 4)).toEqual([0, 0, 0, 1]);
    expect(grilla[grilla.length - 1]).toBe(31);
  });

  it('formatearFechaIso rellena con ceros', () => {
    expect(formatearFechaIso(2026, 0, 5)).toBe('2026-01-05');
    expect(formatearFechaIso(2026, 11, 31)).toBe('2026-12-31');
  });
});

describe('filtrarHorasPorTurno', () => {
  const horas = ['07:00', '08:00', '12:00', '13:00', '18:00', '19:00'];

  it('M1 deja la mañana', () => {
    expect(filtrarHorasPorTurno(horas, 'M1')).toEqual(['07:00', '08:00', '12:00']);
  });
  it('T1 deja la tarde', () => {
    expect(filtrarHorasPorTurno(horas, 'T1')).toEqual(['13:00', '18:00']);
  });
  it('MT1 deja todo el día laboral', () => {
    expect(filtrarHorasPorTurno(horas, 'MT1')).toEqual(['07:00', '08:00', '12:00', '13:00', '18:00']);
  });
  it('un turno desconocido no deja horas', () => {
    expect(filtrarHorasPorTurno(horas, 'X9')).toEqual([]);
  });
  it('se puede extender con un rango nuevo sin tocar la función (OCP)', () => {
    expect(filtrarHorasPorTurno(horas, 'N1', { N1: { desde: 18, hasta: 24 } })).toEqual(['18:00', '19:00']);
  });
});

describe('construirPayloadCita', () => {
  it('numera las sesiones y arma la fecha con segundos', () => {
    const payload = construirPayloadCita({
      pacienteId: 1, doctorId: 2, diagnosticoId: 3, fechaCreacion: '2026-10-10',
      sesiones: [{ fecha: '2026-10-12', hora: '08:00' }, { fecha: '2026-10-14', hora: '09:00' }],
    });
    expect(payload.numero_cita).toBe(2);
    expect(payload.sesiones[0]).toEqual({ numero_sesion: 1, fecha: '2026-10-12 08:00:00', estado: 1 });
    expect(payload.sesiones[1].numero_sesion).toBe(2);
    expect(payload.paciente).toBe(1);
    expect(payload.doctor).toBe(2);
    expect(payload.diagnostico).toBe(3);
  });
});
