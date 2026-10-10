import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { Doctor } from '../../models/doctor.model';
import { Diagnostico } from '../../models/diagnostico.model';
import { Paciente } from '../../models/paciente.model';
import { PacienteService } from '../../services/paciente.service';
import { DisponibilidadDoctorService } from '../../services/disponibilidad-doctor.service';
import { CitaService } from '../../services/cita.service';
import { HttpClientModule } from '@angular/common/http';
import { HorarioService } from '../../services/horario.service';
import Swal from 'sweetalert2';
import { construirMes, formatearFechaIso } from '../../utils/calendario.util';
import { construirPayloadCita } from '../../utils/cita-payload.util';
import { filtrarHorasPorTurno } from '../../config/turnos.config';

interface TurnoDia {
  doctorId: number;
  nombre: string;
  turno: string;
}

interface DiaCalendario {
  numero: number | null;
  turnos: TurnoDia[];
  vacio: boolean;
  pasado?: boolean; // 🔴 AQUI NUEVO
}

interface Sesion {
  id: number;
  numero_sesion: number;
  fecha: string;   // o Date
  estado: number;
}

interface CitaConSesiones {
  id: number;
  numero_cita: number;
  fecha_creacion: string;
  id_doctor: { nombre: string };
  id_diagnostico: { nombre: string };
  sesiones: Sesion[];
}

@Component({
  selector: 'app-citar',
  standalone: true,
  imports: [CommonModule,NgFor, FormsModule, HttpClientModule],
  templateUrl: './citar.html',
  styleUrl: './citar.css',
})
export class Citar {

  fisioterapeutaSeleccionado: number |  null = null;

  calendarioCompleto: DiaCalendario[] = [];
  calendarioFiltrado: DiaCalendario[] = [];

  doctor: Doctor[] = [];
  diagnostico: Diagnostico[] = [];

  pacientes: Paciente[] = [];
  textoPaciente = '';

  disponibilidadCompleta: DiaCalendario[] = [];

  turnoSeleccionado: {
    terapista: string;
    turno: string;
    fecha: string;
    sede: string;
    horas: string[];
  } | null = null;

  horaSeleccionada: string | null = null;

  pacienteSeleccionado: any = null;
  sesionesProgramadas: {
    fecha: string;
    hora: string;
  }[] = [];

  diagnosticoSeleccionado: number | null = null;

  anioActual = new Date().getFullYear();
  mesActual = new Date().getMonth(); // 0–11

  constructor(
    private doctorService: DoctorService,
    private diagnosticoService: DiagnosticoService,
    private cdr: ChangeDetectorRef,
    private pacienteService: PacienteService,
    private disponibilidadService: DisponibilidadDoctorService,
    private citaService: CitaService,
    private horarioService: HorarioService
  ) {
  }

  ngOnInit() {
    this.generarCalendario();
    this.calendarioFiltrado = [...this.calendarioCompleto];
    this.cargarDiagnosticos();
    this.cargarDoctores();
     this.cargarDisponibilidad(); 
  }

  confirmarHora() {
    if (!this.turnoSeleccionado || !this.horaSeleccionada) {
      return;
    }

    const fecha = this.turnoSeleccionado.fecha;
    const hora = this.horaSeleccionada;

    // buscar si ya existe sesión ese día
    const index = this.sesionesProgramadas.findIndex(
      s => s.fecha === fecha
    );

    if (index >= 0) {
      // 🔁 reemplaza turno del mismo día
      this.sesionesProgramadas[index].hora = hora;
    } else {
      // ➕ agrega nuevo día
      this.sesionesProgramadas.push({ fecha, hora });
    }

    this.turnoSeleccionado = null;
    this.horaSeleccionada = null;
  }

  seleccionarTurno(dia: number, turno: TurnoDia) {

    if (!dia) return;

    const fecha = formatearFechaIso(this.anioActual, this.mesActual, dia);

    this.horarioService
      .obtenerHorasDisponibles(turno.doctorId, fecha)
      .subscribe(horasDisponibles => {

        const horasFiltradas = this.filtrarHorasPorTurno(
          horasDisponibles,
          turno.turno   // 👈 M / T / MT
        );

        this.turnoSeleccionado = {
          terapista: turno.nombre,
          turno: turno.turno,
          fecha: fecha,
          sede: 'CMI Ancón',
          horas: horasFiltradas   // ✅ YA FILTRADAS
        };

        this.cdr.detectChanges();
      });
  }


  registrarCita() {
    if (!this.pacienteSeleccionado) {
      Swal.fire({ icon: 'warning', title: 'Seleccione un paciente' });
      return;
    }

    if (!this.diagnosticoSeleccionado) {
      Swal.fire({ icon: 'warning', title: 'Seleccione diagnóstico' });
      return;
    }

    if (this.sesionesProgramadas.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Seleccione al menos una sesión' });
      return;
    }

    const doctorSeleccionado = this.doctor.find(d => d.id === this.fisioterapeutaSeleccionado);
    const diagnosticoSeleccionadoObj = this.diagnostico.find(d => d.id === this.diagnosticoSeleccionado);

    if (!doctorSeleccionado) {
      Swal.fire({ icon: 'error', title: `Error: No se encontró el doctor "${this.fisioterapeutaSeleccionado}" en la lista` });
      return;
    }

    if (!diagnosticoSeleccionadoObj) {
      Swal.fire({ icon: 'error', title: `Error: No se encontró el diagnóstico con ID ${this.diagnosticoSeleccionado}` });
      return;
    }

    const payload = construirPayloadCita({
      pacienteId: this.pacienteSeleccionado.id,
      doctorId: doctorSeleccionado.id!,
      diagnosticoId: diagnosticoSeleccionadoObj.id!,
      fechaCreacion: new Date().toISOString().substring(0, 10),
      sesiones: this.sesionesProgramadas,
    });
    this.citaService.registrar(payload).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: '✅ Cita y sesiones registradas', timer: 1800, showConfirmButton: false });
        this.resetFormulario();  
      },
      error: err => {
        console.error(err);
        Swal.fire({ icon: 'error', title: '❌ Error al registrar' });
      }
      
    });
  }

  resetFormulario() {
    this.pacienteSeleccionado = null;
    this.diagnosticoSeleccionado = null;
    this.sesionesProgramadas = [];
    this.horaSeleccionada = null;
    this.turnoSeleccionado = null;
  }

  cargarDisponibilidad() {
    this.disponibilidadService.leer().subscribe({
      next: (data) => {

        this.generarCalendario();

        data.forEach(d => {

          const [anio, mes, dia] = d.fecha.split('-').map(Number);

          // 🚫 si no es el mes visible, ignorar
          if (anio !== this.anioActual || mes - 1 !== this.mesActual) {
            return;
          }

          const diaCalendario = this.calendarioCompleto.find(
            x => !x.vacio && x.numero === dia
          );

          if (diaCalendario) {
            diaCalendario.turnos.push({
              doctorId: d.id_doctor.id,
              nombre: d.id_doctor.nombre,
              turno: d.id_turno.codigo
            });
          }
        });

        this.disponibilidadCompleta = this.calendarioCompleto.map(d => ({
          numero: d.numero,
          vacio: d.vacio,
          pasado: d.pasado, // NEW NEW NEW
          turnos: [...d.turnos]
        }));

        this.calendarioFiltrado = this.calendarioCompleto.map(d => ({
          numero: d.numero,
          vacio: d.vacio,
          turnos: [],
          pasado: d.pasado // NEW NEW NEW
        }));

        this.cdr.detectChanges();
      }
    });
  }

  generarCalendario() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // comparar solo fechas

    this.calendarioCompleto = construirMes<DiaCalendario>(
      this.anioActual,
      this.mesActual,
      () => ({ numero: null, turnos: [], vacio: true }),
      dia => ({
        numero: dia,
        turnos: [],
        vacio: false,
        pasado: new Date(this.anioActual, this.mesActual, dia) < hoy,
      }),
    );
  }

  cargarHorario() {
    if (!this.fisioterapeutaSeleccionado) {
      Swal.fire({ icon: 'warning', title: 'Seleccione un fisioterapeuta' });
      return;
    }

    this.calendarioFiltrado = this.disponibilidadCompleta.map(dia => ({
      numero: dia.numero,
      vacio: dia.vacio,
      pasado: dia.pasado, //NEW NEW NEW NEW
      turnos: dia.vacio || dia.pasado
        ? []
        : dia.turnos.filter(
            t => t.doctorId === this.fisioterapeutaSeleccionado
          )
    }));

  }

  cargarDoctores() {
    this.doctorService.leer().subscribe({
      next: (data) => {
        this.doctor = data.map(d => ({
          ...d,
        }));

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  cargarDiagnosticos() {
    this.diagnosticoService.leer().subscribe({
      next: (data) => {
        this.diagnostico = data.map(dia => ({
          ...dia,
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  buscarPaciente() {
    if (this.textoPaciente.trim().length < 3) {
      this.pacientes = [];
      return;
    }

    this.pacienteService.buscarPorNombre(this.textoPaciente)
      .subscribe({
        next: (data) => {
          this.pacientes = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
  }  

  mesSiguiente() {
    if (this.mesActual === 11) {  
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.generarCalendario();
    this.cargarDisponibilidad();
  }

  mesAnterior() {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.generarCalendario();
    this.cargarDisponibilidad();
  }

  filtrarHorasPorTurno(horas: string[], turno: string): string[] {
    return filtrarHorasPorTurno(horas, turno);
  }

}
