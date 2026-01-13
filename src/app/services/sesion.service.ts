import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  private api = 'http://localhost:8080/api/terapia/sesion';

  constructor(private http: HttpClient) {}

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

}
