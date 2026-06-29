import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../models/cita.model';
import { FormsModule } from "@angular/forms";
import { SesionService } from '../../services/sesion.service';
import { HistoriaClinicaResponse, HistorialClinicaService } from '../../services/historial-clinica.service';
import { ModalHcComponent } from '../../components/modal-hc/modal-hc';

@Component({
  selector: 'app-historiaclinica',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor, FormsModule, ModalHcComponent],
  templateUrl: './historiaclinica.html',
  styleUrl: './historiaclinica.css',
})
export class Historiaclinica implements OnInit {

  hc!: string;
  paciente!: Paciente | null;
  citas: Cita[] = [];
  open = false;
  openIndex: number | null = null;
  editar = false;
  sesionEditando: number | null = null;

  historiasClinicas: HistoriaClinicaResponse[] = [];
  hcSeleccionada: HistoriaClinicaResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private cdr: ChangeDetectorRef,
    private sesionService: SesionService,
    private citaService: CitaService,
    private historiaClinicaService: HistorialClinicaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.hc = params.get('hc')! || '';
      if (this.hc) {
        this.cargarPaciente();
      }   
    });  
  }

  cargarPaciente() {
    this.pacienteService.leerPorHC(this.hc).subscribe({
      next: (data) => {
        this.paciente = {
          ...data,
          nacimiento: data.nacimiento
        };
        this.cdr.detectChanges();
        console.log("PERSONA: " + this.paciente.id);
        
        if (this.paciente.id) {
          this.cargarCitas(this.paciente.id);
          this.cargarHistoriasClinicas(this.paciente.id);
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err),
    });
  }

  cargarHistoriasClinicas(pacienteId: number) {
    this.historiaClinicaService.obtenerPorPaciente(pacienteId).subscribe({
      next: (data) => {
        this.historiasClinicas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  abrirModal(hc: HistoriaClinicaResponse) {
    this.hcSeleccionada = hc;
  }

  cerrarModal() {
    this.hcSeleccionada = null;
  }

  onHcActualizado() {
    if (this.paciente?.id) {
      this.cargarHistoriasClinicas(this.paciente.id);
    }
  }

  cargarCitas(idPaciente: number) {
    this.citaService.listarPorPaciente(idPaciente).subscribe({
      next: (data) => {
        // inicializamos sesiones vacío
        this.citas = data.map(cita => ({
          ...cita,
          sesiones: []
        }));

        // por cada cita, cargamos sus sesiones
        this.citas.forEach((cita, index) => {
          this.cargarSesiones(cita.id, index);
        });
      },
      error: err => console.error(err)
    });
  }

  cargarSesiones(idCita: number, index: number) {
    this.sesionService.listarPorCita(idCita).subscribe({
      next: (sesiones) => {
        this.citas[index] = {
          ...this.citas[index],
          sesiones
        };

        console.log(`Sesiones cita ${idCita}:`, sesiones);
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  calcularEdad(fecha: string | Date): number {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }

  trackByCita(index: number, cita: Cita) {
    return cita.id;
  }

  trackBySesion(index: number, sesion: any) {
    return sesion.id;
  }

  toggleCita(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }

  isOpen(index: number): boolean {
    return this.openIndex === index;
  }

  /* NEW */
  guardarPaciente() {
    if (!this.paciente || !this.paciente.id) return;

    this.pacienteService.actualizar(this.paciente.id, this.paciente)
      .subscribe({
        next: (data) => {
          this.paciente = {
            ...data,
            nacimiento: data.nacimiento
          };
          this.editar = false;
          this.cdr.detectChanges();
          alert('Paciente actualizado correctamente');
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar paciente');
        }
      });
  }

  editarEstadoSesion(sesion: any) {
    this.sesionEditando = sesion.id;
  }

  guardarEstadoSesion(sesion: any) {
    this.sesionService.actualizarEstado(sesion.id, sesion.estado).subscribe({
      next: () => {
        this.sesionEditando = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
      }
    });
  }

  eliminarPaciente() {
    if (!this.paciente || !this.paciente.id) return;

    const confirmado = confirm(
      '⚠️ ¿Estás seguro de eliminar este paciente?\n\n' +
      'Se eliminarán también sus citas y sesiones.'
    );

    if (!confirmado) return;

    this.pacienteService.eliminar(this.paciente.id)
      .subscribe({
        next: () => {
          alert('✅ Paciente eliminado correctamente');

          // limpiar vista
          this.paciente = null;
          this.citas = [];

          // redirigir (ajusta ruta si es necesario)
          history.back();
        },
        error: (err) => {
          console.error(err);
          alert('❌ Error al eliminar paciente');
        }
      });
  }
}