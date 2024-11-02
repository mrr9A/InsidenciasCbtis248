import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdministrativoComponent } from './add-administrativo.component';

describe('AddAdministrativoComponent', () => {
  let component: AddAdministrativoComponent;
  let fixture: ComponentFixture<AddAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdministrativoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
