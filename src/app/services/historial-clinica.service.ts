import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';

export interface ArchivoHC {
  id?: number;
  url: string;
  tipoArchivo: string;
  nombreOriginal: string;
  categoria: string;
}

export interface HistoriaClinicaResponse {
  id: number;
  responsable: string;
  especialidad: string;
  descripcion: string;
  fechaRegistro: string;
  archivos: ArchivoHC[];
}

export interface HistoriaClinicaUpdate {
  id?: number;
  pacienteId: number;
  responsable: string;
  especialidad: string;
  descripcion: string;
  archivos: ArchivoHC[];
}

@Injectable({ providedIn: 'root' })
export class HistorialClinicaService extends ApiService {
  private readonly api = this.url('/api/historia-clinica');

  obtenerPorPaciente(pacienteId: number): Observable<HistoriaClinicaResponse[]> {
    return this.http.get<HistoriaClinicaResponse[]>(`${this.api}/paciente/${pacienteId}`);
  }

  /** El backend responde texto plano al crear una historia clínica. */
  crear(payload: unknown): Observable<string> {
    return this.http.post(this.api, payload, { responseType: 'text' });
  }

  actualizar(id: number, dto: HistoriaClinicaUpdate): Observable<any> {
    return this.http.put(`${this.api}/${id}`, dto);
  }

  ultimahc() {
    return this.http.get<number>(`${this.api}/ultima-hc`);
  }
}
