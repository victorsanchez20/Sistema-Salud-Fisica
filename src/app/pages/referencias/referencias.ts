import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

interface Referencia {
  creado: string;
  establecimiento_destino: string;
  servicio_destino: string;
  nombre_paciente: string;
  nro_documento: string;
  personal_refiere: string;
  estado_actual: string;
}

interface ReferenciasResultado {
  creado?: string;
  establecimiento_destino?: string;
  servicio_destino?: string;
  nombre_paciente?: string;
  'nro_documento '?: string;
  personal_refiere?: string;
  estado_actual?: string;
}

interface ReferenciasResponse {
  dni?: string;
  total?: number;
  resultados?: ReferenciasResultado[];
}

@Component({
  selector: 'app-referencias',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './referencias.html',
  styleUrl: './referencias.css',
})
export class Referencias {
  dni = '';
  cargando = false;
  error = '';
  total = 0;
  referencias: Referencia[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  buscarReferencias() {
    this.error = '';
    if (!this.dni?.trim()) {
      this.error = 'Ingrese un DNI válido para buscar referencias.';
      this.referencias = [];
      this.total = 0;
      return;
    }

    this.cargando = true;
    const params = new HttpParams().set('dni', this.dni.trim());

    this.http
      .get<ReferenciasResponse>('http://127.0.0.1:8000/referencias', { params })
      .subscribe({
        next: (response) => {
          this.total = response.total ?? response.resultados?.length ?? 0;
          this.referencias = (response.resultados ?? []).map((item) => ({
            creado: item['creado'] ?? '',
            establecimiento_destino: item['establecimiento_destino'] ?? '',
            servicio_destino: item['servicio_destino'] ?? '',
            nombre_paciente: this.stripHtml(item['nombre_paciente'] ?? ''),
            nro_documento: this.stripHtml(item['nro_documento '] ?? ''),
            personal_refiere: item['personal_refiere'] ?? '',
            estado_actual: item['estado_actual'] ?? '',
          }));
          this.cargando = false;
          console.log(response);
          // Forzar actualización de la vista por si hay problemas con la detección de cambios
          try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
        },
        error: (err) => {
          console.error('Error al cargar referencias:', err);
          this.error = 'No se pudo cargar la lista de referencias. Verifique la conexión o el servidor.';
          this.referencias = [];
          this.total = 0;
          this.cargando = false;
        },
      });
  }

  private stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, '').trim();
  }
}
