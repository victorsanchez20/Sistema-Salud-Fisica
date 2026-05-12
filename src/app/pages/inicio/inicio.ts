import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SesionService } from '../../services/sesion.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

interface Metricas {
  pacientes: number;
  historiasClinicas: number;
  citas: number;
  terapias: number;
  usuarios: number;
  citasCompletadas: number;
}

interface CitaMes {
  mes: string;
  citas: number;
  altura: string;
}

interface PacienteMes {
  mes: string;
  registrados: number;
  altura: string;
}

interface ActividadDia {
  dia: string;
  turnos: number;
  altura: string;
}

interface EstadoCitas {
  total: number;
  completadas: number;
  pendientes: number;
  canceladas: number;
}

@Component({
  selector: 'app-inicio',
  imports: [NgIf, NgFor, CommonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {

  sesiones: any[] = [];
  cargando = true;
  fechaMostrada!: string;
  nombreDoctor!: string;

  metricas: Metricas = {
    pacientes: 1247,
    historiasClinicas: 1189,
    citas: 3420,
    terapias: 8945,
    usuarios: 48,
    citasCompletadas: 3156
  };

  citasPorMes: CitaMes[] = [
    { mes: 'Ene', citas: 280, altura: '85%' },
    { mes: 'Feb', citas: 245, altura: '75%' },
    { mes: 'Mar', citas: 310, altura: '95%' },
    { mes: 'Abr', citas: 265, altura: '80%' },
    { mes: 'May', citas: 290, altura: '88%' },
    { mes: 'Jun', citas: 320, altura: '98%' },
  ];

  pacientesPorMes: PacienteMes[] = [
    { mes: 'Ene', registrados: 45, altura: '60%' },
    { mes: 'Feb', registrados: 52, altura: '70%' },
    { mes: 'Mar', registrados: 38, altura: '50%' },
    { mes: 'Abr', registrados: 61, altura: '82%' },
    { mes: 'May', registrados: 55, altura: '74%' },
    { mes: 'Jun', registrados: 48, altura: '65%' },
  ];

  actividadSemanal: ActividadDia[] = [
    { dia: 'Lun', turnos: 42, altura: '90%' },
    { dia: 'Mar', turnos: 38, altura: '82%' },
    { dia: 'Mié', turnos: 45, altura: '96%' },
    { dia: 'Jue', turnos: 35, altura: '75%' },
    { dia: 'Vie', turnos: 28, altura: '60%' },
    { dia: 'Sáb', turnos: 12, altura: '26%' },
  ];

  estadoCitas: EstadoCitas = {
    total: 285,
    completadas: 198,
    pendientes: 72,
    canceladas: 15
  };

  get donutGradient(): string {
    const total = this.estadoCitas.total;
    const completadas = (this.estadoCitas.completadas / total) * 100;
    const pendientes = (this.estadoCitas.pendientes / total) * 100;
    
    return `conic-gradient(
      #22c55e 0% ${completadas}%,
      #f97316 ${completadas}% ${completadas + pendientes}%,
      #ef4444 ${completadas + pendientes}% 100%
    )`;
  }

  constructor(
    private sesionService: SesionService, 
    private cdr: ChangeDetectorRef
  ) {}

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