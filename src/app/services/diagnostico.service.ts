import { Injectable } from '@angular/core';
import { CrudApiService } from '../core/api.service';
import { Diagnostico } from '../models/diagnostico.model';

@Injectable({ providedIn: 'root' })
export class DiagnosticoService extends CrudApiService<Diagnostico> {
  protected readonly resource = '/api/terapia/diagnostico';

  totalDiagnostico() {
    return this.http.get<number>(`${this.endpoint}/total-diagnostico`);
  }
}
