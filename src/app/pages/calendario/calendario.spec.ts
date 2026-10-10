import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PROVIDERS_PRUEBA } from '../../testing/test-providers';

import { Calendario } from './calendario';

describe('Calendario', () => {
  let component: Calendario;
  let fixture: ComponentFixture<Calendario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendario],
      providers: PROVIDERS_PRUEBA
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calendario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
