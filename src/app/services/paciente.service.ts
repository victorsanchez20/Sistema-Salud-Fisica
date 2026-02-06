import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  
  //private APIURL = 'http://localhost:8080/api/terapia/paciente';
  private APIURL = `${environment.api}/api/terapia/paciente`;
  pacientes: Paciente[] = [];
  textoPaciente = '';

  constructor(private http: HttpClient) {}

  crear(paciente: Paciente) {
    return this.http.post<Paciente>(this.APIURL, paciente);
  }

  leer () {
    return this.http.get<Paciente[]>(this.APIURL);
  }

  leerPorHC(hc: string) {
    return this.http.get<Paciente>(`${this.APIURL}/hc/${hc}`);
  }
  
  buscarPorNombre(nombre: string) {
    return this.http.get<Paciente[]>(`${this.APIURL}/buscar`, { params: { q: nombre } });
  }

  actualizar(id: number, paciente: Paciente) {
    return this.http.put<Paciente>(`${this.APIURL}/${id}`, paciente);
  }

  eliminar(id: number) {
    return this.http.delete<Paciente[]>(`${this.APIURL}/${id}`);
  }

}
