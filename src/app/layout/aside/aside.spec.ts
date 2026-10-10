import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PROVIDERS_PRUEBA } from '../../testing/test-providers';

import { Aside } from './aside';

describe('Aside', () => {
  let component: Aside;
  let fixture: ComponentFixture<Aside>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aside],
      providers: PROVIDERS_PRUEBA
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aside);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
