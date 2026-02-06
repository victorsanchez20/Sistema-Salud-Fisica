import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root', })
export class CitaService {

  //private api = 'http://localhost:8080/api/terapia/cita';
  private api = `${environment.api}/api/terapia/cita`;

  constructor(private http: HttpClient) {}  

  registrar(cita: any): Observable<any> {
    return this.http.post(this.api, cita);
  }

  listarPorPaciente(idPaciente: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.api}/paciente/${idPaciente}`);
  }

  
}
