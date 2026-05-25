import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SesionService } from '../../services/sesion.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';
import { count, forkJoin, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DoctorService } from '../../services/doctor.service';

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

  private destroyedRef = inject(DestroyRef);

  metricas: Metricas = {
    pacientes: 0,
    historiasClinicas: 1189,
    citas: 3420,
    terapias: 0,
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

  pacientesPorMes: PacienteMes[] = [];

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
    private cdr: ChangeDetectorRef,
    private pacienteService: PacienteService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    forkJoin({
      sesiones: this.sesionService.getSesionesProximas(),
      totalPacientes: this.pacienteService.cantidadPaciente(),
      totalDoctores: this.doctorService.leer().pipe(map(doctores => doctores.length)),
      pacientesPorMes: this.pacienteService.cantidadPacientePorMes(),
    }).pipe(
      takeUntilDestroyed(this.destroyedRef)

    ).subscribe({
      next: ({sesiones, totalPacientes, totalDoctores, pacientesPorMes}) => {
        this.metricas.pacientes = totalPacientes;
        this.metricas.terapias = totalDoctores;
        this.sesiones = sesiones;
        this.buildChartData(pacientesPorMes);

        if (sesiones.length) {
            this.fechaMostrada = sesiones[0].fecha;
            this.nombreDoctor = sesiones[0].id_cita.id_doctor?.nombre;
          }
      },

      error: (err) => console.error('Error al cargar total de pacientes:', err),

      complete: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getLastSixMonths(): {key: string, label: string}[] {
    const months: {key: string, label: string}[] = [];
    const now = new Date();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('en-US', {month: 'long'}).toUpperCase() + ' ' + d.getFullYear();
      const label = monthNames[d.getMonth()] + ' ' + d.getFullYear();
      
      months.push({key, label});
    }

    return months;
  }

  buildChartData(apiResponse: {[key: string]: number}): void {
    const last6 = this.getLastSixMonths();
    const maxVal = Math.max(...last6.map(m => apiResponse[m.key] ?? 0), 1);

    this.pacientesPorMes = last6.map(m => {
      const registrados = apiResponse[m.key] ?? 0;
      const altura = Math.round((registrados / maxVal) * 100) + '%';

      return {
        mes: m.label,
        registrados,
        altura
      };
    });
  }
}