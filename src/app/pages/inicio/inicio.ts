import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SesionService } from '../../services/sesion.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';
import { count, forkJoin, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DoctorService } from '../../services/doctor.service';
import { DisponibilidadDoctorService } from '../../services/disponibilidad-doctor.service';
import { HistorialClinicaService } from '../../services/historial-clinica.service';
import { DiagnosticoService } from '../../services/diagnostico.service';

interface Metricas {
  pacientes: number;
  hc: number;
  citas: number;
  terapias: number;
  diagnostico: number;
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
  altura: number;
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
    hc: 0,
    citas: 0,
    terapias: 0,
    diagnostico: 0
  };

  citasPorMes: CitaMes[] = [
    { mes: 'Ene', citas: 0, altura: '%' },
    { mes: 'Feb', citas: 0, altura: '%' },
    { mes: 'Mar', citas: 0, altura: '%' },
    { mes: 'Abr', citas: 0, altura: '%' },
    { mes: 'May', citas: 0, altura: '%' },
    { mes: 'Jun', citas: 0, altura: '%' },
  ];

  pacientesPorMes: PacienteMes[] = [];

  actividadSemanal: ActividadDia[] = [];

  estadoCitas: EstadoCitas = {
    total: 0,
    completadas: 0,
    pendientes: 0,
    canceladas: 0
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
    private doctorService: DoctorService,
    private disponibilidadService: DisponibilidadDoctorService,
    private historialClinicaService: HistorialClinicaService,
    private diagnosticoService: DiagnosticoService
  ) {}

  ngOnInit(): void {
    forkJoin({
      sesiones: this.sesionService.getSesionesProximas(),
      totalPacientes: this.pacienteService.cantidadPaciente(),
      totalDoctores: this.doctorService.leer().pipe(map(doctores => doctores.length)),
      pacientesPorMes: this.pacienteService.cantidadPacientePorMes(),
      totalDisponibilidad: this.disponibilidadService.cantidadDisponibilidad(),
      hcmayor: this.historialClinicaService.ultimahc(),
      totalDiagnostico: this.diagnosticoService.totalDiagnostico(),
      citasPorFecha: this.disponibilidadService.cantidadDisponibilidadPorFecha()
    }).pipe(
      takeUntilDestroyed(this.destroyedRef)

    ).subscribe({
      next: ({sesiones, totalPacientes, totalDoctores, pacientesPorMes, totalDisponibilidad, hcmayor,
          totalDiagnostico, citasPorFecha
      }) => {
        this.metricas.pacientes = totalPacientes;
        this.metricas.terapias = totalDoctores;
        this.sesiones = sesiones;
        this.buildChartData(pacientesPorMes);
        this.metricas.citas = totalDisponibilidad;
        this.metricas.hc = hcmayor;
        this.metricas.diagnostico = totalDiagnostico;
        this.buildChartCitas(citasPorFecha);

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

  buildChartCitas(data: { [fecha: string]: number }): void {
    const fechasOrdenadas = Object.entries(data)
      .map(([fecha, turnos]) => ({ fecha, turnos, fechaObj: new Date(fecha) }))
      .sort((a, b) => a.fechaObj.getTime() - b.fechaObj.getTime())
      .slice(-16);

    const maxVal = Math.max(...fechasOrdenadas.map(item => item.turnos), 1);

    this.actividadSemanal = fechasOrdenadas.map(({ fecha, turnos }) => ({
      dia: fecha,
      turnos,
      altura: Math.round((turnos / maxVal) * 90)  // 140px máximo
    }));
  }
}