import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Historiaclinica } from './historiaclinica';

describe('Historiaclinica', () => {
  let component: Historiaclinica;
  let fixture: ComponentFixture<Historiaclinica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Historiaclinica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Historiaclinica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
