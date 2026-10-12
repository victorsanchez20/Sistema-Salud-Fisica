import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ArchivoHC, HistoriaClinicaResponse, HistorialClinicaService } from '../../services/historial-clinica.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-modal-hc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-hc.html',
  styleUrl: './modal-hc.css'
})
export class ModalHcComponent {
  @Input() hc!: HistoriaClinicaResponse;
  @Input() pacienteId!: number;
  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  private sanitizer = inject(DomSanitizer);
  private historiaClinicaService = inject(HistorialClinicaService);
  private supabaseService = inject(SupabaseService);

  editando = false;
  editResponsable = '';
  editEspecialidad = '';
  editDescripcion = '';
  editArchivos: ArchivoHC[] = [];
  archivosAEliminar: ArchivoHC[] = [];
  subiendo = false;

  archivoActivo: ArchivoHC | null = null;

  ngOnInit() {
    if (this.hc.archivos?.length > 0) {
      this.archivoActivo = this.hc.archivos[0];
    }
  }

  iniciarEdicion() {
    this.editResponsable = this.hc.responsable;
    this.editEspecialidad = this.hc.especialidad;
    this.editDescripcion = this.hc.descripcion;
    this.editArchivos = [...this.hc.archivos];
    this.archivosAEliminar = [];
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.archivosAEliminar = [];
  }

  async guardarEdicion() {
    // 1. Eliminar archivos marcados de Supabase
    for (const archivo of this.archivosAEliminar) {
      try {
        await this.supabaseService.eliminarArchivo(archivo.url);
      } catch (e) {
        console.error('Error al eliminar archivo de Supabase:', e);
      }
    }

    // 2. Preparar payload
    const dto = {
      pacienteId: this.pacienteId,
      responsable: this.editResponsable,
      especialidad: this.editEspecialidad,
      descripcion: this.editDescripcion,
      archivos: this.editArchivos
    };

    // 3. Enviar al backend
    this.historiaClinicaService.actualizar(this.hc.id, dto).subscribe({
      next: () => {
        this.editando = false;
        this.actualizado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        console.error('Error al actualizar HC:', err);
        alert('Error al actualizar la historia clinica');
      }
    });
  }

  async onFileSelected(event: any) {
    const file: File = event.target?.files?.[0];
    if (!file) return;

    this.subiendo = true;
    try {
      const url = await this.supabaseService.subirArchivo(file, this.pacienteId);
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const tipoArchivo = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension) ? 'imagen' : 'pdf';

      this.editArchivos.push({
        url,
        tipoArchivo,
        nombreOriginal: file.name,
        categoria: this.editArchivos.length > 0 ? this.editArchivos[0].categoria : 'Otro'
      });
    } catch (e) {
      console.error('Error al subir archivo:', e);
      alert('Error al subir el archivo');
    } finally {
      this.subiendo = false;
    }
  }

  eliminarArchivo(archivo: ArchivoHC) {
    this.archivosAEliminar.push(archivo);
    this.editArchivos = this.editArchivos.filter(a => a !== archivo);
    if (this.archivoActivo === archivo) {
      this.archivoActivo = this.editArchivos.length > 0 ? this.editArchivos[0] : null;
    }
  }

  async eliminarArchivoPerma(archivo: ArchivoHC) {
    if (!confirm('¿Eliminar este documento de la historia clínica?')) return;

    try {
      await this.supabaseService.eliminarArchivo(archivo.url);

      const archivosRestantes = this.hc.archivos.filter(a => a !== archivo);
      const dto = {
        pacienteId: this.pacienteId,
        responsable: this.hc.responsable,
        especialidad: this.hc.especialidad,
        descripcion: this.hc.descripcion,
        archivos: archivosRestantes
      };

      this.historiaClinicaService.actualizar(this.hc.id, dto).subscribe({
        next: () => {
          this.hc.archivos = archivosRestantes;
          if (this.archivoActivo === archivo) {
            this.archivoActivo = archivosRestantes.length > 0 ? archivosRestantes[0] : null;
          }
        },
        error: (err) => {
          console.error('Error al eliminar archivo:', err);
          alert('Error al eliminar el archivo');
        }
      });
    } catch (e) {
      console.error('Error al eliminar de Supabase:', e);
      alert('Error al eliminar el archivo del almacenamiento');
    }
  }

  async agregarArchivo(event: any) {
    const file: File = event.target?.files?.[0];
    if (!file) return;

    this.subiendo = true;
    try {
      const url = await this.supabaseService.subirArchivo(file, this.pacienteId);
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const tipoArchivo = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension) ? 'imagen' : 'pdf';

      const nuevoArchivo: ArchivoHC = {
        url,
        tipoArchivo,
        nombreOriginal: file.name,
        categoria: 'Otro'
      };

      const archivosActualizados = [...this.hc.archivos, nuevoArchivo];
      const dto = {
        pacienteId: this.pacienteId,
        responsable: this.hc.responsable,
        especialidad: this.hc.especialidad,
        descripcion: this.hc.descripcion,
        archivos: archivosActualizados
      };

      this.historiaClinicaService.actualizar(this.hc.id, dto).subscribe({
        next: () => {
          this.hc.archivos = archivosActualizados;
          if (!this.archivoActivo) {
            this.archivoActivo = nuevoArchivo;
          }
        },
        error: (err) => {
          console.error('Error al agregar archivo:', err);
          alert('Error al guardar el archivo');
        }
      });
    } catch (e) {
      console.error('Error al subir a Supabase:', e);
      alert('Error al subir el archivo');
    } finally {
      this.subiendo = false;
    }
  }

  esImagen(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  esPDF(url: string): boolean {
    return /\.pdf$/i.test(url);
  }

  obtenerUrlSegura(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  seleccionarArchivo(archivo: ArchivoHC) {
    this.archivoActivo = archivo;
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}
