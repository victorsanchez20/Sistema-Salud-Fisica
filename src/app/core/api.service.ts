import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base-url.token';

/** Base común de todos los servicios que consumen la API REST. */
export abstract class ApiService {
  protected readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  /** Construye la URL completa a partir de una ruta relativa ("/api/terapia/turno"). */
  protected url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

/**
 * CRUD estándar (crear / leer / actualizar / eliminar) sobre un recurso REST.
 * Los servicios de catálogo solo declaran su ruta y heredan las 4 operaciones
 * que antes estaban copiadas en cada uno.
 */
export abstract class CrudApiService<T> extends ApiService {
  protected abstract readonly resource: string;

  protected get endpoint(): string {
    return this.url(this.resource);
  }

  crear(item: T): Observable<T> {
    return this.http.post<T>(this.endpoint, item);
  }

  leer(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint);
  }

  actualizar(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${id}`, item);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}
