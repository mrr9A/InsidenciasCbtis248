import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAvisoComponent } from './add-aviso.component';

describe('AddAvisoComponent', () => {
  let component: AddAvisoComponent;
  let fixture: ComponentFixture<AddAvisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAvisoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
