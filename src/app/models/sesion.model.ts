export interface Sesion {
  id: number;
  numero_sesion: number;
  fecha: string;          // LocalDateTime → string (ISO)
  estado: number;

  id_cita?: {
    id: number;
    numero_cita: number;
    fecha_creacion: string;
  };
}
