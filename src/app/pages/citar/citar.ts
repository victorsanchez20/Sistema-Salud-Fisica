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
import { SesionService } from '../../services/sesion.service';

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
    private sesionService: SesionService
  ) {
      console.log('CitaService disponible:', !!citaService);
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

    const fecha = `${this.anioActual}-${String(this.mesActual + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

    this.sesionService
      .getHorasDisponibles(turno.doctorId, fecha)
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
      alert('Seleccione un paciente');
      return;
    }

    if (!this.diagnosticoSeleccionado) {
      alert('Seleccione diagnóstico');
      return;
    }

    if (this.sesionesProgramadas.length === 0) {
      alert('Seleccione al menos una sesión');
      return;
    }

    // DEBUG: Mostrar los valores actuales
    console.log('fisioterapeutaSeleccionado:', this.fisioterapeutaSeleccionado);
    console.log('doctor array:', this.doctor);
    console.log('diagnosticoSeleccionado:', this.diagnosticoSeleccionado);
    console.log('diagnostico array:', this.diagnostico);

    // Buscar el doctor seleccionado - usar trim() para eliminar espacios
    const doctorSeleccionado = this.doctor.find(
      d => d.id === this.fisioterapeutaSeleccionado
    );

    
    // Buscar el diagnóstico seleccionado
    const diagnosticoSeleccionadoObj = this.diagnostico.find(d => 
      d.id === this.diagnosticoSeleccionado
    );
    
    console.log('doctorSeleccionado encontrado:', doctorSeleccionado);
    console.log('diagnosticoSeleccionadoObj encontrado:', diagnosticoSeleccionadoObj);
    
    if (!doctorSeleccionado) {
      alert(`Error: No se encontró el doctor "${this.fisioterapeutaSeleccionado}" en la lista`);
      return;
    }
    
    if (!diagnosticoSeleccionadoObj) {
      alert(`Error: No se encontró el diagnóstico con ID ${this.diagnosticoSeleccionado}`);
      return;
    }

    // Crear la cita en el formato que espera el backend
    const payload = {
      paciente: this.pacienteSeleccionado.id,        // solo el ID
      doctor: doctorSeleccionado.id,                // solo el ID
      diagnostico: diagnosticoSeleccionadoObj.id,  // solo el ID
      fecha_creacion: new Date().toISOString().substring(0, 10),
      numero_cita: this.sesionesProgramadas.length,
      sesiones: this.sesionesProgramadas.map((s, index) => ({
        numero_sesion: index + 1,
        fecha: `${s.fecha} ${s.hora}:00`, // → "2026-01-02 07:00:00",
        estado: 1
      }))
    };
    console.log('PAYLOAD FINAL:', payload);
    this.citaService.registrar(payload).subscribe({
      next: () => {
        alert('✅ Cita y sesiones registradas');
        this.resetFormulario();  
      },
      error: err => {
        console.error(err);
        alert('❌ Error al registrar');
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
    this.calendarioCompleto = [];

    const anio = this.anioActual;
    const mes = this.mesActual;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // 🔑 comparar solo fechas

    const primerDia = new Date(anio, mes, 1);
    let diaSemana = primerDia.getDay();
    diaSemana = diaSemana === 0 ? 6 : diaSemana - 1;

    // 🔹 DÍAS VACÍOS INICIO
    for (let i = 0; i < diaSemana; i++) {
      this.calendarioCompleto.push({
        numero: null,
        turnos: [],
        vacio: true
      });
    }

    const diasMes = new Date(anio, mes + 1, 0).getDate();

    // 🔹 DÍAS REALES DEL MES
    for (let d = 1; d <= diasMes; d++) {
      const fechaObj = new Date(anio, mes, d);
      fechaObj.setHours(0, 0, 0, 0);

      this.calendarioCompleto.push({
        numero: d,
        turnos: [],
        vacio: false,
        pasado: fechaObj < hoy   // 🔴 AQUÍ ESTÁ LA CLAVE
      });
    }
  }

  cargarHorario() {
    if (!this.fisioterapeutaSeleccionado) {
      alert('Seleccione un fisioterapeuta');
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
    console.log('Doctor seleccionado:', this.fisioterapeutaSeleccionado, typeof this.fisioterapeutaSeleccionado);
  console.log('Turnos disponibles:', this.disponibilidadCompleta);

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
    return horas.filter(hora => {
      const h = parseInt(hora.split(':')[0], 10);

      if (turno === 'M1') {
        return h >= 7 && h < 13;
      }

      if (turno === 'T1') {
        return h >= 13 && h < 19;
      }

      if (turno === 'MT1') {
        return h >= 7 && h < 19;
      }

      return false;
    });
  }

}