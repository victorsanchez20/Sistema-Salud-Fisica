import { Injectable } from '@angular/core';
import { Diagnostico } from '../models/diagnostico.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DiagnosticoService {
  //private APIURL = 'http://localhost:8080/api/terapia/diagnostico';
  private APIURL = `${environment.api}/api/terapia/diagnostico`;

  constructor(private http: HttpClient) {}

  crear(diagnostico: Diagnostico) {
    return this.http.post<Diagnostico>(this.APIURL, diagnostico);
  }

  leer() {
    return this.http.get<Diagnostico[]>(this.APIURL);
  }

  actualizar(id: number, diagnostico: Diagnostico) {
    return this.http.put(`${this.APIURL}/${id}`, diagnostico);
  }

  eliminar(id: number) {
    return this.http.delete<Diagnostico[]>(`${this.APIURL}/${id}`)
  }
}
