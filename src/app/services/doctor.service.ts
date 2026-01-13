import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  
  private API_URL  = 'http://localhost:8080/api/terapia/doctor';

  constructor(private http: HttpClient) {}

  crear(doctor: Doctor) {
    return this.http.post<Doctor>(this.API_URL, doctor);
  }

  leer() {
    return this.http.get<Doctor[]>(this.API_URL);
  }

  actualizar(id: number, doctor: Doctor) {
    return this.http.put(`${this.API_URL}/${id}`, doctor);
  }

  eliminar(id: number) {
    return this.http.delete<Doctor[]>(`${this.API_URL}/${id}`);
  }

  getDoctorConPacientes(nombre: string): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/datos/${encodeURIComponent(nombre)}`
    );
  }
}
