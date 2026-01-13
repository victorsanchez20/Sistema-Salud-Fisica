import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { NgFor, NgIf } from '@angular/common';
import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-turnospaciente',
  imports: [NgIf, NgFor],
  templateUrl: './turnospaciente.html',
  styleUrl: './turnospaciente.css',
})
export class Turnospaciente implements OnInit {

  doctor: any;
  pacientes: any[] = [];
  cargando = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const nombreDoctor = this.route.snapshot.paramMap.get('nombre')!;
    this.cargarDatos(nombreDoctor);
  }

  cargarDatos(nombre: string) {
    this.doctorService.getDoctorConPacientes(nombre)
      .subscribe({
        next: (res) => {
          this.doctor = res.doctor;
          this.pacientes = res.pacientes;
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

