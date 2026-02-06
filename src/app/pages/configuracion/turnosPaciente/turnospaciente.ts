import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../../services/horario.service';

@Component({
  selector: 'app-turnospaciente',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './turnospaciente.html',
  styleUrl: './turnospaciente.css',
})
export class Turnospaciente implements OnInit {

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
      alert('Esa hora ya está agregada');
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
          console.log('HORAS BD:', horas);
          this.horasSeleccionadas = horas;
          this.cdr.detectChanges();
        },
        error: err => console.error(err)
      });
  }


  eliminarHora(hora: string) {
    this.horasSeleccionadas =
      this.horasSeleccionadas.filter(h => h !== hora);
  }

  guardarHorario() {
    if (!this.horasSeleccionadas.length) {
      alert('Agregue al menos una hora');
      return;
    }

    const payload = {
      doctorId: this.doctor.id,
      horas: this.horasSeleccionadas
    };

    this.horarioService.guardarHorario(payload)
      .subscribe({
        next: () => {
          alert('Horario guardado correctamente');
          this.cargarHorasDoctor(); // 🔥 CLAVE
        },
        error: err => console.error(err)
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
        console.error(err);
        this.cargando = false;
      }
    });
}


  irHistoria(hc: string) {
    this.router.navigate(['/historiaclinica', hc]);
  }
}
