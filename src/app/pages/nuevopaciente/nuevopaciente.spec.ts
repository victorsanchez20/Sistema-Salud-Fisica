import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PROVIDERS_PRUEBA } from '../../testing/test-providers';

import { Nuevopaciente } from './nuevopaciente';

describe('Nuevopaciente', () => {
  let component: Nuevopaciente;
  let fixture: ComponentFixture<Nuevopaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nuevopaciente],
      providers: PROVIDERS_PRUEBA
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nuevopaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
