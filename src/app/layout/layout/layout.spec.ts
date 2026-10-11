import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PROVIDERS_PRUEBA } from '../../testing/test-providers';

import { Layout } from './layout';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: PROVIDERS_PRUEBA
    })
    .compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('alterna y cierra el menú lateral (RFC-17)', () => {
    expect(component.menuAbierto).toBe(false);
    component.alternarMenu();
    expect(component.menuAbierto).toBe(true);
    component.cerrarMenu();
    expect(component.menuAbierto).toBe(false);
  });
});
