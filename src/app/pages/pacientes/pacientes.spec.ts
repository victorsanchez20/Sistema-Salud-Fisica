import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PROVIDERS_PRUEBA } from '../../testing/test-providers';

import { Pacientes } from './pacientes';

describe('Pacientes', () => {
  let component: Pacientes;
  let fixture: ComponentFixture<Pacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pacientes],
      providers: PROVIDERS_PRUEBA
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pacientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('las filas de pacientes se pueden enfocar con el teclado (RFC-18)', () => {
    fixture = TestBed.createComponent(Pacientes);
    component = fixture.componentInstance;
    component.pacientes = [{ id: 1, hc: 'HC000001', nombre: 'Ana', apaterno: 'Quispe', amaterno: 'Rojas', dni: '70000001', nacimiento: '1988-03-14' } as any];
    component.pacientesPaginados = component.pacientes;
    fixture.detectChanges();
    const fila: HTMLElement = fixture.nativeElement.querySelector('tbody tr');
    expect(fila.getAttribute('tabindex')).toBe('0');
    expect(fila.getAttribute('aria-label')).toContain('HC000001');
  });
});
