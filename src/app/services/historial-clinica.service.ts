import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ArchivoHC {
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



@Injectable({
  providedIn: 'root',
})
export class HistorialClinicaService {
  constructor(private http: HttpClient) {}

  obtenerPorPaciente(pacienteId: number): Observable<HistoriaClinicaResponse[]> {
    return this.http.get<HistoriaClinicaResponse[]>(
    `${environment.api}/api/historia-clinica/paciente/${pacienteId}`);
  }

  ultimahc() {
    return this.http.get<number>(`${environment.api}/api/historia-clinica/ultima-hc`);
  }
}
