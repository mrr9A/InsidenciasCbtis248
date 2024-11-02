import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApisService } from '../../services/apis.service';

@Component({
  selector: 'app-add-aviso',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-aviso.component.html',
  styleUrl: './add-aviso.component.css'
})
export class AddAvisoComponent {
  itemForm: FormGroup;
  grupos: any[] = [];

  constructor(private fb: FormBuilder, private apiService: ApisService) {
    this.itemForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      grupoIds: this.fb.array([], Validators.required)  // Usar FormArray para almacenar múltiples IDs
    });
  }

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.apiService.getGrupos().subscribe({
      next: (data: any) => {
        this.grupos = data;
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
      }
    });
  }

  onGrupoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(select.selectedOptions);
    const grupoIdsArray = this.itemForm.get('grupoIds') as FormArray;

    // Limpiar los IDs seleccionados antes de agregar los nuevos
    grupoIdsArray.clear();

    selectedOptions.forEach(option => grupoIdsArray.push(this.fb.control(parseInt(option.value, 10))));
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;
      console.log('Datos enviados:', formData);

      // Llamada a la API para guardar los datos
      this.apiService.postAvisos(formData).subscribe({
        next: () => console.log('Item guardado con éxito'),
        error: (error) => console.error('Error al guardar item:', error)
      });
    }
  }
}
