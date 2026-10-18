import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudApiService } from '../core/api.service';
import { Paciente } from '../models/paciente.model';

@Injectable({ providedIn: 'root' })
export class PacienteService extends CrudApiService<Paciente> {
  protected readonly resource = '/api/terapia/paciente';

  // Estado compartido entre pantallas (se conserva tal como estaba)
  pacientes: Paciente[] = [];
  textoPaciente = '';

  leerPorHC(hc: string) {
    return this.http.get<Paciente>(`${this.endpoint}/hc/${hc}`);
  }

  buscarPorNombre(nombre: string) {
    return this.http.get<Paciente[]>(`${this.endpoint}/buscar`, { params: { q: nombre } });
  }

  buscarPorDNI(dni: string) {
    return this.http.get<Paciente[]>(`${this.endpoint}/${dni}`);
  }

  cantidadPaciente() {
    return this.http.get<number>(`${this.endpoint}/cantidad-pacientes`);
  }

  cantidadPacientePorMes(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.endpoint}/cantidad-pacientes-ultimos-meses`);
  }

  pacientesPorEdad(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.endpoint}/pacientes-por-edad`);
  }

  ultimahc() {
    return this.http.get<number>(`${this.resource}/ultima-hc`);
  }
}
