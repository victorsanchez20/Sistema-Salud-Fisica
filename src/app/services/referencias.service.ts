import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ReferenciaItem {
  nombcompper: string;
  fechaaceptacion: string;
  aceptacionrecibido: string;
  nroreferencia: string;
  idupsdestino: string;
  nombestdestino: string;
  horaini: string;
  envioaceptacion: string;
  consultoriocita: string;
  fgobservado: string;
  idpaciente: number;
  diaact: number;
  nombubigeo: string;
  mesact: number;
  nomcomppac: string;
  fgprioridad: string;
  correopac: string;
  flagedad: number;
  llegada: string;
  fgestado: string;
  nompaciente: string;
  annioact: number;
  fechaenvio: string;
  fechaini: string;
  tanexo: number;
  descarteraservicio: string;
  condicion: string;
  especialidad: string;
  descupsdestino: string;
  fechacita: string;
  idreferencia: number | null;
  idcita: number;
  fechacreacion: string;
  idestreferido: number;
  estadoactual: string;
  edadactual: string;
  observacioncita: string;
  celularpac: string;
  fechapacrecibido: string;
  numdocpaciente: string;
  medicocita: string;
}

export interface ReferenciaResponse {
  total: number;
  items: ReferenciaItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ReferenciasService {
  // La ruta proxy local se configura en proxy.conf.json para evitar CORS en desarrollo.
  // Usamos un prefijo diferente a la ruta de la página para evitar servir el index.html.
  private readonly API_URL = '/api/referencias';

  constructor(private http: HttpClient) {}

  consultarReferencias(idtipodoc: number, numdoc: string, idestado = -1, page = 1, start = 0, limit = 25) {
    const params = new HttpParams()
      .set('_dc', Date.now().toString())
      .set('idtipodoc', String(idtipodoc))
      .set('numdoc', numdoc)
      .set('idestado', String(idestado))
      .set('C', 'REFERENCIA')
      .set('S', 'REFERIDOSHIST')
      .set('idflag', 'CP')
      .set('page', String(page))
      .set('start', String(start))
      .set('limit', String(limit));

    return this.http.get<ReferenciaResponse>(this.API_URL, { params });
  }
}
