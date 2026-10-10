import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class SesionService extends ApiService {
  private readonly api = this.url('/api/terapia/sesion');

  listarPorCita(idCita: number) {
    return this.http.get<any[]>(`${this.api}/cita/${idCita}`);
  }

  getHorasOcupadas(fecha: string, doctorId: number) {
    return this.http.get<string[]>(
      `${this.api}/sesiones-ocupadas?fecha=${fecha}&doctorId=${doctorId}`
    );
  }

  getSesionesProximas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/proximas`);
  }

  actualizarEstado(id: number, estado: number) {
    return this.http.put<any>(`${this.api}/${id}/estado`, { estado });
  }

  contarEstados() {
    return this.http.get<{ registrada: number; completada: number; cancelada: number }>(`${this.api}/estados-count`);
  }
}
