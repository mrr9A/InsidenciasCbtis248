import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAnuncioComponent } from './modal-anuncio.component';

describe('ModalAnuncioComponent', () => {
  let component: ModalAnuncioComponent;
  let fixture: ComponentFixture<ModalAnuncioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAnuncioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAnuncioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
