import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoAlumnoComponent } from './card-info-alumno.component';

describe('CardInfoAlumnoComponent', () => {
  let component: CardInfoAlumnoComponent;
  let fixture: ComponentFixture<CardInfoAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInfoAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardInfoAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
