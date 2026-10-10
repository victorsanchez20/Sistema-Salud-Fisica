import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudApiService } from '../core/api.service';
import { Doctor } from '../models/doctor.model';

@Injectable({ providedIn: 'root' })
export class DoctorService extends CrudApiService<Doctor> {
  protected readonly resource = '/api/terapia/doctor';

  getDoctorConPacientes(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/datos/${encodeURIComponent(nombre)}`);
  }
}
