import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PROVIDERS_PRUEBA } from '../../testing/test-providers';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: PROVIDERS_PRUEBA
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('el enlace Calendario apunta a la ruta /calendario (RFC-16)', () => {
    const enlaces: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const calendario = enlaces.find(a => a.textContent?.includes('Calendario'));
    expect(calendario?.getAttribute('href')).toBe('/calendario');
  });
});
