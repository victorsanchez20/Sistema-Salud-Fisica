import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Citar } from './citar';

describe('Citar', () => {
  let component: Citar;
  let fixture: ComponentFixture<Citar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Citar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Citar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
