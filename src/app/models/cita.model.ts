import { Sesion } from "./sesion.model";

export interface Cita {
  id: number;
  fecha_creacion: string;
  numero_cita: number;
  id_doctor: { nombre: string; };
  id_diagnostico: { nombre: string; };
  sesiones: Sesion[];
}

/** Sesión tal como la espera el backend al registrar una cita. */
export interface SesionRequest {
  numero_sesion: number;
  fecha: string;   // "yyyy-MM-dd HH:mm:ss"
  estado: number;
}

/** Cuerpo del POST /api/terapia/cita. */
export interface CitaRequest {
  paciente: number;
  doctor: number;
  diagnostico: number;
  fecha_creacion: string;   // "yyyy-MM-dd"
  numero_cita: number;
  sesiones: SesionRequest[];
}
