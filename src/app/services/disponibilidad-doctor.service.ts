import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DisponibilidadDTO } from '../models/disponibilidad.model';
import { CalendarioGuardado } from '../models/calendarioGuardado.model';
import { DisponibilidadView } from '../models/disponivilidadView.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DisponibilidadDoctorService {
  //private APIURL = 'http://localhost:8080/api/terapia/disponibilidad';
  private APIURL = `${environment.api}/api/terapia/disponibilidad`;


  constructor(private http: HttpClient) {}

  guardarMasivo(data: DisponibilidadDTO[]) {
    return this.http.post(`${this.APIURL}/masivo`, data);
  }

  leer() {
    return this.http.get<any[]>(this.APIURL);
  }


  getCalendariosGuardados() {
    return this.http.get<CalendarioGuardado[]>(
      `${this.APIURL}/calendarios`
    );
  }


  listarPorMesAnio(mes: number, anio: number) {
    return this.http.get<DisponibilidadView[]>(
      `${this.APIURL}/listar?mes=${mes}&anio=${anio}`
    );
  }

  //new
  eliminarCalendario(mes: number, anio: number) {
    return this.http.delete(
      `${this.APIURL}/calendario?mes=${mes}&anio=${anio}`
    );
  }


}
