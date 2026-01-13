import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Paciente } from '../../models/paciente.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { CommonModule } from '@angular/common';

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
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      hc: [''],
      nacimiento: [''],
      nacionalidad: [''],
      direccion: [''],
      telefono: ['', Validators.required],
    })
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
        alert('Paciente registrado correctamente');
        this.pacienteForm.reset();
      },
      error: (err) => {
          console.error(err);
          alert('Error al registrar paciente');
      },
    })
  }
}
