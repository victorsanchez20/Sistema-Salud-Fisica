import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private api = 'http://localhost:8080/horarios';

  constructor(private http: HttpClient) {}

  obtenerHorasDisponibles(doctorId: number, fecha: string): Observable<string[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId)
      .set('fecha', fecha);

    return this.http.get<string[]>(`${this.api}/horas-disponibles`, { params });
  }

  guardarHorario(payload: {
    doctorId: number;
    horas: string[];
  }) {
    return this.http.post('http://localhost:8080/horarios/guardar', payload)
  }

  getHorasDoctor(doctorId: number) {
  return this.http.get<string[]>(
    `http://localhost:8080/horarios/doctor/${doctorId}`
  );
}


}
