export interface Paciente {
  id?: number;
  apaterno: string;
  amaterno: string;
  nombre: string;
  dni: string;
  hc: string;
  telefono: string;
  direccion: string;
  nacimiento: Date | null;   // ⬅️ Date, NO string
  nacionalidad: string;
}
