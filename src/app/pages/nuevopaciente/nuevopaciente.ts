import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Paciente } from '../../models/paciente.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevopaciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nuevopaciente.html',
  styleUrl: './nuevopaciente.css',
})
export class Nuevopaciente {
  
  pacienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {
    this.pacienteForm = this.fb.group({
      apaterno: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      amaterno: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      nacimiento: [''],
      nacionalidad: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required,  Validators.pattern('^[0-9]{9}$')]],
    });
  }

  get formControls() {
    return this.pacienteForm.controls;
  }

  guardar() {
    console.log(this.pacienteForm.value);
    console.log(this.pacienteForm.valid);


    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      return;
    }

    const paciente: Paciente = this.pacienteForm.value;

    this.pacienteService.crear(paciente).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Paciente registrado correctamente', timer: 1400, showConfirmButton: false });
        this.pacienteForm.reset();
      },
      error: (err) => {

        if (err.status === 409) {
          Swal.fire({ icon: 'error', title: err.error.message });
          return;
        }

          console.error(err);
          Swal.fire({ icon: 'error', title: 'Error al registrar paciente' });
      },
    })
  }
}
