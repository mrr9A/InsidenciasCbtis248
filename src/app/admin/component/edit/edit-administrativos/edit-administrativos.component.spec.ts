import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdministrativosComponent } from './edit-administrativos.component';

describe('EditAdministrativosComponent', () => {
  let component: EditAdministrativosComponent;
  let fixture: ComponentFixture<EditAdministrativosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdministrativosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdministrativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
