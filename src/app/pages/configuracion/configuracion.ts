import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor.model';
import { Diagnostico } from '../../models/diagnostico.model';
import { DoctorService } from '../../services/doctor.service';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Turno } from '../../models/turno.model';
import { TurnoService } from '../../services/turno.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {

  doctor: Doctor[] = [];
  doctorForm: FormGroup;
  showTerapista = false;
  
  turnos: Turno[] = [];
  turnoForm!: FormGroup;
  showTurno = false;
  
  diagnostico: Diagnostico[] = [];
  diagnosticoForm: FormGroup;
  showDiagnostico = false;

  editandoDoctor: Doctor | null = null;
  editandoDiagnostico: Diagnostico | null = null;
  editandoTurno: Turno | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private diagnosticoService: DiagnosticoService,
    private cdr: ChangeDetectorRef,
    private turnoService: TurnoService) {
    this.doctorForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: '1'
    })

    this.diagnosticoForm = this.fb.group({
      nombre: ['', Validators.required]
    })

    this.turnoForm = this.fb.group({
      codigo: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
    });
  }

  ngOnInit(): void {
      this.cargarDiagnosticos();
      this.cargarDoctores();
      this.cargarTurno();
  }

  /* SAVE DATOS */
  guardarDoctor() {
    console.log(this.doctorForm.value);
    console.log(this.doctorForm.valid);

    if(this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const doctor: Doctor = this.doctorForm.value;

    // 🟡 EDITAR
    if (this.editandoDoctor) {
      this.doctorService.actualizar(this.editandoDoctor.id!, doctor)
        .subscribe(() => {
          alert('Doctor actualizado');
          this.cargarDoctores();
          this.closeTerapistaModal();
          this.doctorForm.reset();
          this.editandoDoctor = null;
        });
      return;
    }

    // Crear 
    this.doctorService.crear(doctor).subscribe({
      next: () => {
        alert('Doctor registrado correctamente');
        this.doctorForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar doctor');
      }
    })
  }
  guardarDiagnostico() {
    console.log(this.diagnosticoForm.value);
    console.log(this.diagnosticoForm.valid);

    if(this.diagnosticoForm.invalid) {
      this.diagnosticoForm.markAllAsTouched();
      return;
    }

    const diagnostico: Diagnostico = this.diagnosticoForm.value;

    // 🟡 EDITAR
    if (this.editandoDiagnostico) {
      this.diagnosticoService.actualizar(this.editandoDiagnostico.id!, diagnostico)
        .subscribe(() => {
          alert('Diagnostico actualizado');
          this.cargarDiagnosticos();
          this.closeDiagnosticoModal();
          this.diagnosticoForm.reset();
          this.editandoDiagnostico = null;
        });
      return;
    }

    // Crear
    this.diagnosticoService.crear(diagnostico).subscribe({
      next: () => {
        alert('Diagnostico registrado correctamente');
        this.diagnosticoForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar diagnostico');
      }
    })
  }
  guardarTurno() {
    const turno = {
      codigo: this.turnoForm.value.codigo,
      hora_inicio: this.turnoForm.value.hora_inicio,
      hora_fin: this.turnoForm.value.hora_fin,
    };

    console.log('📤 Turno que se enviará:', turno);

    // 🟡 EDITAR
    if (this.editandoTurno) {
      this.turnoService.actualizar(this.editandoTurno.id!, turno)
        .subscribe(() => {
          alert('Turno actualizado');
          this.cargarTurno();
          this.closeTurnoModal();
          this.turnoForm.reset();
          this.editandoTurno = null;
        });
      return;
    }

    // Crear
    this.turnoService.crear(turno).subscribe({
      next: () => {
        console.log('✅ Turno guardado correctamente');
        this.cargarTurno();
        this.closeTurnoModal();
        this.turnoForm.reset();
      },
      error: (err) => {
        console.error('❌ Error al guardar turno', err);
      }
    });
  }

  /* CARGAR DATOS */
  cargarTurno() {
    this.turnoService.leer().subscribe({
      next: (data) => {
        this.turnos = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar turnos', err);
      }
    });
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

  /* SAVE DATA OF MODALS */
  openTerapistaModal() {
    this.showTerapista = true;
  }
  closeTerapistaModal() {
    this.showTerapista = false;
  }
  openDiagnosticoModal() {
    this.showDiagnostico = true;
  }
  closeDiagnosticoModal() {
    this.showDiagnostico = false;
  }
  openTurnoModal() {
    this.showTurno = true;
  }
  closeTurnoModal() {
    this.showTurno = false;
  }

  /* ELIMINAR DATOS */
  eliminarDoctor(id: number) {
    if(!confirm('¿Seguro que deseas eliminar este terapista?')) {
      return;
    }

    this.doctorService.eliminar(id).subscribe({
      next: () => {
        alert('Terapista eliminado.');
        this.cargarDoctores();
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar.');
      }
    });
  }
  eliminarDiagnostico(id: number) {
    if(!confirm('¿Seguro que deseas eliminar este tipo de diagnostico?')) {
      return;
    }

    this.diagnosticoService.eliminar(id).subscribe({
      next: () => {
        alert('Diagnostico eliminado.');
        this.cargarDiagnosticos();
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar.');
      }
    });
  }
  eliminarTurno(id: number) {
    if(!confirm('¿Seguro que deseas eliminar este turno?')) {
      return;
    }

    this.turnoService.eliminar(id).subscribe({
      next: () => {
        alert('Turno eliminado.');
        this.cargarTurno();
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar.');
      }
    })
  }

  /* EDITAR DATOS */
  editarDoctor(d: Doctor) {
    this.editandoDoctor = d;
    this.showTerapista = true;

    this.doctorForm.patchValue({
      nombre: d.nombre,
      estado: d.estado
    });
  }
  editarDiagnostico(d: Diagnostico) {
    this.editandoDiagnostico = d;
    this.showDiagnostico = true;

    this.diagnosticoForm.patchValue({
      nombre: d.nombre,
      descripcion: d.descripcion
    });
  }
  editarTurno(t: Turno) {
    this.editandoTurno = t;
    this.showTurno = true;

    this.turnoForm.patchValue({
      codigo: t.codigo,
      hora_inicio: t.hora_inicio,
      hora_fin: t.hora_fin
    })
  }


  irTurnosPaciente(nombre: string) {
    this.router.navigate(['/datos', nombre]);

  }
}