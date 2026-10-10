import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { DisponibilidadDTO } from '../models/disponibilidad.model';
import { CalendarioGuardado } from '../models/calendarioGuardado.model';
import { DisponibilidadView } from '../models/disponivilidadView.model';

@Injectable({ providedIn: 'root' })
export class DisponibilidadDoctorService extends ApiService {
  private readonly APIURL = this.url('/api/terapia/disponibilidad');

  guardarMasivo(data: DisponibilidadDTO[]) {
    return this.http.post(`${this.APIURL}/masivo`, data);
  }

  leer() {
    return this.http.get<any[]>(this.APIURL);
  }

  getCalendariosGuardados() {
    return this.http.get<CalendarioGuardado[]>(`${this.APIURL}/calendarios`);
  }

  listarPorMesAnio(mes: number, anio: number) {
    return this.http.get<DisponibilidadView[]>(`${this.APIURL}/listar?mes=${mes}&anio=${anio}`);
  }

  eliminarCalendario(mes: number, anio: number) {
    return this.http.delete(`${this.APIURL}/calendario?mes=${mes}&anio=${anio}`);
  }

  cantidadDisponibilidad(): Observable<number> {
    return this.http.get<number>(`${this.APIURL}/cantidad-disponibilidad`);
  }

  cantidadDisponibilidadPorFecha() {
    return this.http.get<{ [fecha: string]: number }>(`${this.APIURL}/cantidad-por-fecha`);
  }
}
