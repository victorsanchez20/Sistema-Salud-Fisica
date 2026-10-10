import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class HorarioService extends ApiService {
  private readonly api = this.url('/horarios');

  obtenerHorasDisponibles(doctorId: number, fecha: string): Observable<string[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId)
      .set('fecha', fecha);

    return this.http.get<string[]>(`${this.api}/horas-disponibles`, { params });
  }

  guardarHorario(payload: { doctorId: number; horas: string[] }) {
    return this.http.post(`${this.api}/guardar`, payload);
  }

  getHorasDoctor(doctorId: number) {
    return this.http.get<string[]>(`${this.api}/doctor/${doctorId}`);
  }
}
