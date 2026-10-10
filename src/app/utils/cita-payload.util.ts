import { CitaRequest } from '../models/cita.model';

export interface SesionProgramada {
  fecha: string;  // yyyy-MM-dd
  hora: string;   // HH:mm
}

export interface DatosCita {
  pacienteId: number;
  doctorId: number;
  diagnosticoId: number;
  sesiones: SesionProgramada[];
  /** Fecha de creación (yyyy-MM-dd); se recibe para que la función sea pura y testeable. */
  fechaCreacion: string;
}

/** Estado "registrada" de una sesión recién agendada (coincide con EstadoSesion.REGISTRADA del backend). */
export const ESTADO_SESION_REGISTRADA = 1;

/** Arma el cuerpo que espera POST /api/terapia/cita (antes se armaba dentro del componente). */
export function construirPayloadCita(datos: DatosCita): CitaRequest {
  return {
    paciente: datos.pacienteId,
    doctor: datos.doctorId,
    diagnostico: datos.diagnosticoId,
    fecha_creacion: datos.fechaCreacion,
    numero_cita: datos.sesiones.length,
    sesiones: datos.sesiones.map((s, index) => ({
      numero_sesion: index + 1,
      fecha: `${s.fecha} ${s.hora}:00`,
      estado: ESTADO_SESION_REGISTRADA,
    })),
  };
}
