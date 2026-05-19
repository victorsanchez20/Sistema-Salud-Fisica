// modal-hc.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ArchivoHC, HistoriaClinicaResponse } from '../../services/historial-clinica.service';


@Component({
  selector: 'app-modal-hc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-hc.html',
  styleUrl: './modal-hc.css'
})
export class ModalHcComponent {
  @Input() hc!: HistoriaClinicaResponse;
  @Output() cerrar = new EventEmitter<void>();

  private sanitizer = inject(DomSanitizer);
  archivoActivo: ArchivoHC | null = null;

  ngOnInit() {
    if (this.hc.archivos?.length > 0) {
      this.archivoActivo = this.hc.archivos[0];
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