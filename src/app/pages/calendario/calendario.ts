import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { DisponibilidadDTO } from '../../models/disponibilidad.model';
import { DisponibilidadDoctorService } from '../../services/disponibilidad-doctor.service';
import { Doctor } from '../../models/doctor.model';
import { DoctorService } from '../../services/doctor.service';
import { Turno } from '../../models/turno.model';
import { TurnoService } from '../../services/turno.service';
import { FormsModule } from '@angular/forms';
import { CalendarioGuardado } from '../../models/calendarioGuardado.model';
import { DisponibilidadView } from '../../models/disponivilidadView.model';

interface TurnoDia {
  nombre: string;
  turno: string;
}

interface DiaCalendario {
  numero: number;
  turnos: TurnoDia[];
  vacio?: boolean;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario implements OnInit {

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  calendario: DiaCalendario[] = [];

  mes!: number;
  anio!: number;

  turnos: Turno[] = [];

  doctores: Doctor[] = [];

  meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  anios: number[] = [];

  calendariosGuardados: CalendarioGuardado[] = [];
  slideActivo = 0;

    // ===== MODAL =====
  mostrarModal = false;

  modalMes!: number;
  modalAnio!: number;
  modalCalendario: DiaCalendario[] = [];


  constructor(private disponibilidadService: DisponibilidadDoctorService,
              private doctorService: DoctorService,
              private turnoService: TurnoService,
              private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const hoy = new Date();

    this.mes = hoy.getMonth() + 1;
    this.anio = hoy.getFullYear();

    // rango de años (ej: actual ±2)
    for (let a = this.anio - 2; a <= this.anio + 2; a++) {
      this.anios.push(a);
    }

    this.generarCalendario();
    this.cargarDoctores();
    this.cargarTurnos();
    this.cargarCalendariosGuardados();
  }

  abrirCalendarioModal(cal: CalendarioGuardado) {

    this.modalMes = cal.mes;
    this.modalAnio = cal.anio;

    // 1️⃣ generar SOLO la estructura del modal
    this.generarCalendarioModal();

    // 2️⃣ cargar datos SOLO para el modal
    this.disponibilidadService
      .listarPorMesAnio(this.modalMes, this.modalAnio)
      .subscribe((data: DisponibilidadView[]) => {

        for (const item of data) {
          const diaMes = Number(item.fecha.split('-')[2]);

          const dia = this.modalCalendario.find(
            d => !d.vacio && d.numero === diaMes
          );

          if (dia) {
            dia.turnos.push({
              nombre: item.doctor,
              turno: item.turno
            });
          }
        }

        // 3️⃣ forzar render
        this.modalCalendario = [...this.modalCalendario];
        this.mostrarModal = true;
        this.cargarCalendariosGuardados();
      });


  }

  generarCalendarioModal() {
    const calendario: DiaCalendario[] = [];

    const primerDia = new Date(this.modalAnio, this.modalMes - 1, 1).getDay();
    const offset = (primerDia + 6) % 7;

    for (let i = 0; i < offset; i++) {
      calendario.push({
        numero: 0,
        turnos: [],
        vacio: true
      });
    }

    const diasMes = new Date(this.modalAnio, this.modalMes, 0).getDate();

    for (let d = 1; d <= diasMes; d++) {
      calendario.push({
        numero: d,
        turnos: []
      });
    }

    this.modalCalendario = calendario;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  nuevoCalendario() {
    const hoy = new Date();
    this.mes = hoy.getMonth() + 1;
    this.anio = hoy.getFullYear();

    this.calendario = [];
    this.generarCalendario();
  }

  cargarDisponibilidadDesdeBD() {

    // limpiar turnos
    for (const dia of this.calendario) {
      dia.turnos = [];
    }

    this.disponibilidadService
      .listarPorMesAnio(this.mes, this.anio)
      .subscribe((data: DisponibilidadView[]) => {

        for (const item of data) {

          // ⛔ NO usar Date() (timezone)
          const [anio, mes, diaMes] = item.fecha.split('-').map(Number);

          // 🔑 buscar el día REAL en el calendario
          const dia = this.calendario.find(
            d => !d.vacio && d.numero === diaMes
          );

          if (dia) {
            dia.turnos.push({
              nombre: item.doctor,
              turno: item.turno
            });
          }
        }

        this.calendario = [...this.calendario];
      });
  }

  cargarCalendariosGuardados() {
    this.disponibilidadService.getCalendariosGuardados().subscribe({
      next: data => {
        this.calendariosGuardados = data;
        this.cd.detectChanges(); // 🔑 CLAVE
      },
      error: err => console.error(err)
    });
  }

  cargarTurnos() {
    this.turnoService.leer().subscribe({
      next: data => {
        this.turnos = data;
        console.log('TURNOS BD →', this.turnos);
      },
      error: err => console.error(err)
    });
  }


  cargarDoctores() {
    this.doctorService.leer().subscribe({
      next: (data) => {
        this.doctores = data;
        console.log('DOCTORES BD →', this.doctores);
      },
      error: err => console.error(err)
    });
  }

  normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  generarCalendario() {
    this.calendario = [];

    // día real en que empieza el mes (0=Dom, 1=Lun...)
    const primerDia = new Date(this.anio, this.mes - 1, 1).getDay();

    // convertir a lunes=0
    const offset = (primerDia + 6) % 7;

    // días vacíos antes del día 1
    for (let i = 0; i < offset; i++) {
      this.calendario.push({
        numero: 0,
        turnos: [],
        vacio: true
      });
    }

    // cantidad real de días del mes
    const diasMes = new Date(this.anio, this.mes, 0).getDate();

    for (let d = 1; d <= diasMes; d++) {
      this.calendario.push({
        numero: d,
        turnos: []
      });
    }
  }

  cargarExcel(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const filas: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      console.log('EXCEL COMPLETO →', filas);

      // fila con números 1..31
      const filaDiasIndex = filas.findIndex(row =>
        row.some(c => typeof c === 'number' && c === 1)
      );

      if (filaDiasIndex === -1) return;

      const filaDias = filas[filaDiasIndex];
      const colInicioDias = filaDias.findIndex(c => c === 1);

      const filasPersonal = filas
        .slice(filaDiasIndex + 1)
        .filter(f => typeof f[0] === 'number' && f[1]);

      this.generarCalendario();

      const primerDia = new Date(this.anio, this.mes - 1, 1).getDay();
      const offset = (primerDia + 6) % 7; // lunes = 0


      for (const persona of filasPersonal) {
        const nombrePersona = persona[1];

        for (let i = 0; i < 31; i++) {
          const turno = persona[colInicioDias + i];

          const indexCalendario = offset + i;

          if (turno && this.calendario[indexCalendario]) {
            this.calendario[indexCalendario].turnos.push({
              nombre: nombrePersona,
              turno: turno.toString().trim()
            });
          }
        }
        this.cd.detectChanges();
      }

      this.calendario = [...this.calendario];
      console.log('CALENDARIO FINAL →', this.calendario);
    };

    reader.readAsArrayBuffer(file);
  }

  generarDisponibilidadDTO(): DisponibilidadDTO[] {

    const resultado: DisponibilidadDTO[] = [];

    for (const dia of this.calendario) {

      if (dia.vacio || dia.numero === 0) continue;

      for (const t of dia.turnos) {

        const idDoctor = this.obtenerIdDoctorPorNombre(t.nombre);
        const idTurno = this.obtenerIdTurnoPorCodigo(t.turno);

        if (idDoctor === 0 || idTurno === 0) continue;

        const fecha = `${this.anio}-${String(this.mes).padStart(2,'0')}-${String(dia.numero).padStart(2,'0')}`;

        resultado.push({
          idDoctor: idDoctor,
          idTurno: idTurno,   // ✅ LONG
          fecha: fecha
        });
      }
    }

    console.log('DTO FINAL →', resultado);
    return resultado;
  }

  guardarEnBD() {
    const payload = this.generarDisponibilidadDTO();

    this.disponibilidadService.guardarMasivo(payload).subscribe({
      next: () => alert('✅ Turnos guardados correctamente'),
      error: err => console.error('❌ Error al guardar', err)
    });
  }

  obtenerIdDoctorPorNombre(nombreExcel: string): number {
    const nombreNormalizado = this.normalizar(nombreExcel);

    const doctor = this.doctores.find(d =>
      nombreNormalizado.includes(this.normalizar(d.nombre))
    );

    if (!doctor) {
      console.warn('Doctor no encontrado:', nombreExcel);
      return 0; // o lanzar error
    }

    return doctor.id!;
  }

  obtenerIdTurnoPorCodigo(codigoExcel: string): number {
    const codigo = codigoExcel.trim().toUpperCase();

    const turno = this.turnos.find(
      t => t.codigo.trim().toUpperCase() === codigo
    );

    if (!turno) {
      console.warn('Turno no encontrado:', codigoExcel);
      return 0;
    }

    return turno.id!;
  }

  //new
  eliminarCalendario(cal: CalendarioGuardado, event: Event) {
    event.stopPropagation(); // ⛔ no abrir modal

    const confirmar = confirm(
      `¿Eliminar el calendario de ${this.meses[cal.mes - 1].label} ${cal.anio}?`
    );

    if (!confirmar) return;

    this.disponibilidadService
      .eliminarCalendario(cal.mes, cal.anio)
      .subscribe({
        next: () => {
          alert('✅ Calendario eliminado');
          this.cargarCalendariosGuardados();

          // limpiar vista si era el mismo
          if (this.mes === cal.mes && this.anio === cal.anio) {
            this.calendario = [];
            this.generarCalendario();
          }
        },
        error: err => console.error('❌ Error al eliminar', err)
      });
  }

}