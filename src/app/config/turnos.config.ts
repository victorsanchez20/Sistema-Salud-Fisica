/**
 * Rangos horarios por código de turno. Para soportar un turno nuevo basta
 * con agregar una entrada aquí; filtrarHorasPorTurno no se modifica (OCP).
 * (Antes eran tres `if (turno === 'M1' ...)` dentro del componente Citar.)
 */
export interface RangoHorario {
  /** Hora de inicio (inclusive), 0–23. */
  desde: number;
  /** Hora de fin (exclusive), 0–23. */
  hasta: number;
}

export const RANGOS_TURNO: Readonly<Record<string, RangoHorario>> = {
  M1: { desde: 7, hasta: 13 },   // mañana
  T1: { desde: 13, hasta: 19 },  // tarde
  MT1: { desde: 7, hasta: 19 },  // mañana y tarde
};

/** Deja solo las horas ("HH:mm") que caen dentro del turno; turno desconocido → ninguna. */
export function filtrarHorasPorTurno(
  horas: string[],
  codigoTurno: string,
  rangos: Readonly<Record<string, RangoHorario>> = RANGOS_TURNO,
): string[] {
  const rango = rangos[codigoTurno];
  if (!rango) {
    return [];
  }
  return horas.filter(hora => {
    const h = parseInt(hora.split(':')[0], 10);
    return h >= rango.desde && h < rango.hasta;
  });
}
