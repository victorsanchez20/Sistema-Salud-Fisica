/**
 * Utilidades puras para armar la grilla mensual (semana Lun–Dom).
 * Antes esta lógica estaba copiada tres veces (citar.generarCalendario,
 * calendario.generarCalendario y calendario.generarCalendarioModal).
 * El mes se expresa en base 0 (enero = 0), igual que Date.
 */

/** Celdas vacías antes del día 1 para que el mes empiece en su día de la semana (lunes = 0). */
export function diasVaciosAntesDelPrimero(anio: number, mes0: number): number {
  const primerDia = new Date(anio, mes0, 1).getDay(); // 0 = domingo
  return (primerDia + 6) % 7;
}

export function cantidadDiasDelMes(anio: number, mes0: number): number {
  return new Date(anio, mes0 + 1, 0).getDate();
}

/**
 * Construye la grilla del mes. Cada pantalla decide la forma de sus celdas
 * mediante las fábricas, sin duplicar el algoritmo de la grilla.
 */
export function construirMes<T>(
  anio: number,
  mes0: number,
  crearVacio: () => T,
  crearDia: (numero: number) => T,
): T[] {
  const celdas: T[] = [];
  const vacios = diasVaciosAntesDelPrimero(anio, mes0);
  for (let i = 0; i < vacios; i++) {
    celdas.push(crearVacio());
  }
  const totalDias = cantidadDiasDelMes(anio, mes0);
  for (let dia = 1; dia <= totalDias; dia++) {
    celdas.push(crearDia(dia));
  }
  return celdas;
}

/** Formatea una fecha como yyyy-MM-dd sin pasar por Date (evita problemas de zona horaria). */
export function formatearFechaIso(anio: number, mes0: number, dia: number): string {
  return `${anio}-${String(mes0 + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}
