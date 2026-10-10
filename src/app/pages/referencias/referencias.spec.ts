import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PROVIDERS_PRUEBA } from '../../testing/test-providers';

import { Referencias } from './referencias';

describe('Referencias', () => {
  let component: Referencias;
  let fixture: ComponentFixture<Referencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Referencias],
      providers: PROVIDERS_PRUEBA
    })
    .compileComponents();

    fixture = TestBed.createComponent(Referencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
