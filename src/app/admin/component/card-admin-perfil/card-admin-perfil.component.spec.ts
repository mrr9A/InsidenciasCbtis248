import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdminPerfilComponent } from './card-admin-perfil.component';

describe('CardAdminPerfilComponent', () => {
  let component: CardAdminPerfilComponent;
  let fixture: ComponentFixture<CardAdminPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAdminPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAdminPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
