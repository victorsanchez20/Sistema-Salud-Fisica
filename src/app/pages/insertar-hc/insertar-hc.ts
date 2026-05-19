import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { SupabaseService } from '../../services/supabase.service';
import { environment } from '../../../environments/environment';

interface Documento {
  id: number;
  label: string;
  archivo: File;
  tipoArchivo: string;
  previewUrl: SafeResourceUrl | null;
  previewUrlRaw: string;
} 

@Component({
  selector: 'app-insertar-hc',
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './insertar-hc.html',
  styleUrl: './insertar-hc.css',
})
export class InsertarHc implements OnInit {

  archivoSeleccionado: File | null = null;
  previewUrl: SafeResourceUrl | null = null;
  previewUrlRaw: string | null = null;
  tipoArchivo: string = '';
  
  subiendo = false;
  urlsSubidad: string[] = [];

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // Limpiar URLs de todos los documentos
    this.documentos.forEach(doc => {
      if(doc.previewUrlRaw) {
        URL.revokeObjectURL(doc.previewUrlRaw);
      }
    });
  }

  constructor(
    private pacienteService: PacienteService,
    private supabaseService: SupabaseService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
  }

  paciente: Paciente = {
    id: undefined,
    apaterno: '',
    amaterno: '',
    nombre: '',
    dni: '',
    hc: '',
    telefono: '',
    direccion: '',
    nacimiento: new Date(),
    nacionalidad: ''
  };

  // Data del html
  responsable = '';
  especialidad = '';
  descripcion = '';

  docTipo = 'Informe Médico';
  
  documentos: Documento[] = [];
  proximoIdDocumento = 1;
  paginaActual = 1;
  docSeleccionado: number | null = null;

  get totalPaginas(): number {
    return Math.max(1, this.documentos.length);
  }


  limpiar() {
    this.paciente = { id: undefined, apaterno: '', amaterno: '', nombre: '', dni: '', hc: '', telefono: '', direccion: '', nacimiento: new Date(), nacionalidad: '' };
    this.responsable = '';
    this.especialidad = '';
    this.descripcion = '';
  }

  async guardar() {

    // Validator
    if (!this.paciente.id) {
      alert('Debe buscar un paciente primero');
      return;
    }

    this.subiendo = true;
    this.urlsSubidad = [];

    try {
      //1. Subir cada archivo a supabase
      for (const doc of this.documentos) {
        const url = await this.supabaseService.subirArchivo(doc.archivo, this.paciente.id!);
        this.urlsSubidad.push(url);
      }

      // 2. Enviar datos + URLs al backend spring boot
      const payload = {
        pacienteId: this.paciente.id,
        responsable: this.responsable,
        especialidad: this.especialidad,
        descripcion: this.descripcion,
        archivos: this.documentos.map((doc, i) => ({
          url: this.urlsSubidad[i],
          tipo: doc.tipoArchivo,
          nombre: doc.label,
          categoria: this.docTipo
        }))
      };

      await this.http.post(`${environment.api}/api/historia-clinica`, payload, {
        responseType: 'text'
      }).toPromise();

      alert('Historia clinica guardada correctamente');
      this.limpiar();
      this.documentos = [];
      this.paginaActual = 1;
      this.docSeleccionado = null;

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Ocurrió un error al guardar. Revisa la consola.');
    } finally {
      this.subiendo = false;
    }
  }

  anterior() { 
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.docSeleccionado = this.paginaActual - 1;
    }
  }

  siguiente() { 
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.docSeleccionado = this.paginaActual - 1;
    }
  }

  seleccionarDoc(i: number) { 
    this.docSeleccionado = i;
    this.paginaActual = i + 1;
  }

  deleteArchivo(idDocumento: number) {
    this.documentos = this.documentos.filter(doc => doc.id !== idDocumento);
    
    // Ajustar paginaActual si es necesario
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
      this.docSeleccionado = this.paginaActual - 1;
      
    } else if (this.totalPaginas === 0) {
      this.paginaActual = 1;
      this.docSeleccionado = null;
    }
  }


  buscarPacientePorDNI() {
    console.log('🔍 Buscando paciente con DNI:', this.paciente.dni);

    if (!this.paciente.dni.trim()) {
      console.warn('⚠️ DNI vacío, no se puede buscar');
      return;
    }

    this.pacienteService.buscarPorDNI(this.paciente.dni).subscribe({
      next: (data: any) => {
        console.log('📦 Respuesta del servidor:', data);
        this.paciente = {
          ...data,
          nacimiento: new Date(data.nacimiento)
        };
        this.cd.detectChanges();
        console.log('✅ Paciente encontrado:', data.amaterno, data.apaterno, data.nombre + ' - DNI: ' + data.dni);
      },
      error: (error) => {
        console.error('❌ Error al buscar paciente por DNI:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if(!file) return;

    const tipoArchivo = file.type;
    const url = URL.createObjectURL(file);
    
    // Crear nuevo documento y agregarlo al array
    const nuevoDocumento: Documento = {
      id: this.proximoIdDocumento++,
      label: file.name,
      archivo: file,
      tipoArchivo: tipoArchivo,
      previewUrl: this.sanitizer.bypassSecurityTrustResourceUrl(url),
      previewUrlRaw: url
    };

    this.documentos.push(nuevoDocumento);
    
    // Seleccionar automáticamente el nuevo documento
    this.docSeleccionado = this.documentos.length - 1;
    this.paginaActual = this.documentos.length;
    
    console.log('Documento agregado:', nuevoDocumento.label);
    this.cd.detectChanges();
  }

  obtenerDocumentoActual(): Documento | null {
    if (this.docSeleccionado !== null && this.documentos[this.docSeleccionado]) {
      return this.documentos[this.docSeleccionado];
    }
    return null;
  }
}
