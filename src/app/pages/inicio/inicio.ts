import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SesionService } from '../../services/sesion.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit{

  sesiones: any[] = [];
  cargando = true;
  fechaMostrada!: string;
  nombreDoctor!: string;

  constructor(
    private sesionService: SesionService, 
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sesionService.getSesionesProximas()
      .subscribe({
        next: (res) => {
          this.sesiones = res;

          if (res.length) {
            this.fechaMostrada = res[0].fecha;
            this.nombreDoctor = res[0].id_cita.id_doctor?.nombre;
          }

          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: () => this.cargando = false
      });
  }
}
