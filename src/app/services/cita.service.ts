import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Cita, CitaRequest } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService extends ApiService {
  private readonly api = this.url('/api/terapia/cita');

  registrar(cita: CitaRequest): Observable<Cita> {
    return this.http.post<Cita>(this.api, cita);
  }

  listarPorPaciente(idPaciente: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.api}/paciente/${idPaciente}`);
  }
}
