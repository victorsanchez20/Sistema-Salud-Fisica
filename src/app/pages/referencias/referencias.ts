import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenciasService, ReferenciaItem } from '../../services/referencias.service';

interface Referencia {
  creado: string;
  establecimiento_destino: string;
  servicio_destino: string;
  nombre_paciente: string;
  nro_documento: string;
  personal_refiere: string;
  estado_actual: string;
}

@Component({
  selector: 'app-referencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './referencias.html',
  styleUrl: './referencias.css',
})
export class Referencias {
  tipodoc = '';
  dni = '';
  cargando = false;
  error = '';
  total = 0;
  referencias: Referencia[] = [];

  constructor(private referenciasService: ReferenciasService, private cdr: ChangeDetectorRef) {}

  buscarReferencias() {
    this.error = '';
    if (!this.tipodoc || !this.dni) {
      this.error = 'Ingrese tipodoc y DNI válidos para buscar referencias.';
      this.referencias = [];
      this.total = 0;
      return;
    }

    const idtipodoc = Number(this.tipodoc);
    if (!idtipodoc || idtipodoc <= 0) {
      this.error = 'Ingrese un tipodoc numérico válido.';
      this.referencias = [];
      this.total = 0;
      return;
    }

    this.cargando = true;
    this.referenciasService.consultarReferencias(idtipodoc, this.dni.trim()).subscribe({
      next: (response) => {
        this.total = response.total;
        this.referencias = response.items.map((item: ReferenciaItem) => ({
          creado: item.fechacreacion || '',
          establecimiento_destino: item.nombestdestino || '',
          servicio_destino: item.especialidad || '',
          nombre_paciente: this.stripHtml(item.nomcomppac || item.nompaciente || ''),
          nro_documento: item.numdocpaciente || '',
          personal_refiere: item.nombcompper || '',
          estado_actual: item.estadoactual || '',
        }));
        this.cargando = false;
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
