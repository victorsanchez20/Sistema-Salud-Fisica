import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, CommonModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css',
})
export class Pacientes implements OnInit {

  pacientes: Paciente[] = [];

  pageSize = 12;
  paginaActual = 1;
  totalPaginas = 0;
  pacientesPaginados: Paciente[] = [];

  textoBusqueda = '';
  pacientesOriginal: Paciente[] = [];


  constructor(
    private router: Router,
    private pacienteService: PacienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.pacienteService.leer().subscribe({
      next: (data) => {
        const pacientesConvertidos = data.map(p => ({
          ...p,
          nacimiento: new Date(p.nacimiento)
        }));

        this.pacientesOriginal = pacientesConvertidos;
        this.pacientes = pacientesConvertidos;

        this.totalPaginas = Math.ceil(this.pacientes.length / this.pageSize);
        this.cambiarPagina(1);

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }


  buscarPaciente(valor: string) {
    this.textoBusqueda = valor.trim();

    if (this.textoBusqueda === '') {
      // volver a todos
      this.pacientes = this.pacientesOriginal;
    } else {
      this.pacientes = this.pacientesOriginal.filter(p =>
        p.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        p.apaterno.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        p.amaterno.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        p.dni.includes(this.textoBusqueda) ||
        p.hc.includes(this.textoBusqueda)
      );
    }

    this.totalPaginas = Math.ceil(this.pacientes.length / this.pageSize);
    this.cambiarPagina(1);
  }


  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;

    this.paginaActual = pagina;

    const inicio = (pagina - 1) * this.pageSize;
    const fin = inicio + this.pageSize;

    this.pacientesPaginados = this.pacientes.slice(inicio, fin);
  }

  paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }


  irHistoriaClinica(hc: string) {
    this.router.navigate(['/historiaclinica', hc]);
  }

  calcularEdad(fecha: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  }

   irAgregarPaciente() {
    this.router.navigate(['/nuevopacientes']);
  }
}