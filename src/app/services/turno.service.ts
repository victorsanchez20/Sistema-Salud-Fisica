import { Injectable } from '@angular/core';
import { CrudApiService } from '../core/api.service';
import { Turno } from '../models/turno.model';

@Injectable({ providedIn: 'root' })
export class TurnoService extends CrudApiService<Turno> {
  protected readonly resource = '/api/terapia/turno';
}
