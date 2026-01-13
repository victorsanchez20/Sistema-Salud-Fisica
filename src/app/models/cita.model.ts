import { Sesion } from "./sesion.model";

export interface Cita {
  id: number;
  fecha_creacion: string;
  numero_cita: number;
  id_doctor: { nombre: string; };
  id_diagnostico: { nombre: string; };
  sesiones: any[];
}
