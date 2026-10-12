import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../../services/horario.service';
import Swal from 'sweetalert2';
import { LoggerService } from '../../../core/logger.service';

@Component({
  selector: 'app-turnospaciente',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './turnospaciente.html',
  styleUrl: './turnospaciente.css',
})
export class Turnospaciente implements OnInit {
  private readonly log = inject(LoggerService);

  // 👉 HORAS DEL DOCTOR
  horasSeleccionadas: string[] = [];
  nuevaHora: string = '';


  // 👉 DATA
  doctor: any;
  pacientes: any[] = [];
  cargando = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private horarioService: HorarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const nombreDoctor = this.route.snapshot.paramMap.get('nombre')!;
    this.cargarDatos(nombreDoctor);
    
  }

  // ==========================
  // HORAS
  // ==========================

  agregarHora() {
    if (!this.nuevaHora) return;

    if (this.horasSeleccionadas.includes(this.nuevaHora)) {
      Swal.fire({ icon: 'warning', title: 'Esa hora ya está agregada' });
      return;
    }

    this.horasSeleccionadas.push(this.nuevaHora);
    this.horasSeleccionadas.sort();
    this.nuevaHora = '';
  }

  cargarHorasDoctor() {
    if (!this.doctor?.id) return;

    this.horarioService.getHorasDoctor(this.doctor.id)
      .subscribe({
        next: (horas) => {
          this.horasSeleccionadas = horas;
          this.cdr.detectChanges();
        },
        error: err => this.log.error('Error en la operación', err)
      });
  }


  eliminarHora(hora: string) {
    this.horasSeleccionadas =
      this.horasSeleccionadas.filter(h => h !== hora);
  }

  guardarHorario() {
    if (!this.horasSeleccionadas.length) {
      Swal.fire({ icon: 'warning', title: 'Agregue al menos una hora' });
      return;
    }

    const payload = {
      doctorId: this.doctor.id,
      horas: this.horasSeleccionadas
    };

    this.horarioService.guardarHorario(payload)
      .subscribe({
        next: () => {
            Swal.fire({ icon: 'success', title: 'Horario guardado correctamente', timer: 1400, showConfirmButton: false });
            this.cargarHorasDoctor(); // 🔥 CLAVE
          },
        error: err => this.log.error('Error en la operación', err)
      });
  }
  // ==========================
  // DATA
  // ==========================
cargarDatos(nombre: string) {
  this.doctorService.getDoctorConPacientes(nombre)
    .subscribe({
      next: (res) => {
        this.doctor = res.doctor;
        this.pacientes = res.pacientes;

        // 🔥 AQUI ESTABA LO QUE FALTABA
        this.cargarHorasDoctor();

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.log.error('Error en la operación', err);
        this.cargando = false;
      }
    });
}


  irHistoria(hc: string) {
    this.router.navigate(['/historiaclinica', hc]);
  }
}
