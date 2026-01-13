import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Turno } from '../models/turno.model';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  //private API_URL  = 'http://localhost:8080/api/terapia/turno';
  private API_URL  = 'https://sistema-salud-backend.onrender.com/api/terapia/turno';

  constructor(private http: HttpClient) {}

  crear(turno: Turno) {
    return this.http.post<Turno>(this.API_URL, turno);
  }

  leer() {
    return this.http.get<Turno[]>(this.API_URL);
  }

  actualizar(id: number, turno: Turno) {
    return this.http.put(`${this.API_URL}/${id}`, turno);
  }

  eliminar(id: number) {
    return this.http.delete<Turno[]>(`${this.API_URL}/${id}`)
  }
}
