import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { onTimeService } from '../../services/actulizarInfor.service';

@Component({
  selector: 'app-add-aviso',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,MatSelectModule,MenuAdminComponent],
  templateUrl: './add-aviso.component.html',
  styleUrl: './add-aviso.component.css'
})
export class AddAvisoComponent {
  itemForm: FormGroup;
  grupos: any[] = [];
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imagePreview: string | null = null; // Para almacenar la URL de la imagen para la previsualización

  constructor(private onTimeService : onTimeService,private fb: FormBuilder, private apiService: ApisService) {
    this.itemForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      img: ['placeholder', Validators.required],
      file: [],
      folder: ['avisos', Validators.required],
      grupoIds: this.fb.array([], Validators.required)  // Usar FormArray para almacenar múltiples IDs
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
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

  onGrupoChange(event: any): void {
    const gruposIds = this.itemForm.get('grupoIds') as FormArray;
    gruposIds.clear(); // Limpiar el array antes de añadir nuevos valores

    // Aquí, `event.value` debe ser un array de los IDs seleccionados
    event.value.forEach((grupoId: number) => {
      gruposIds.push(this.fb.control(grupoId)); // Asegúrate de que aquí agregas el control correctamente
    });
  }


  // Función para manejar la selección de la imagen
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.selectedImage = input.files[0]; // Guarda el archivo de imagen en la variable

      // Crear una URL para la imagen seleccionada y asignarla a imagePreview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Almacena la URL de la imagen
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
/*       const alumnoIds = this.tutorForm.get('alumnoIds')?.value;
      console.log(alumnoIds); */

        const formData = new FormData();

        formData.append('nombre', this.itemForm.get('nombre')?.value);
        formData.append('descripcion', this.itemForm.get('descripcion')?.value);
        formData.append('fecha', this.itemForm.get('fecha')?.value);
        formData.append('img', this.itemForm.get('img')?.value);
        formData.append('folder', this.itemForm.get('folder')?.value);
        formData.append('grupoIds', JSON.stringify(this.itemForm.get('grupoIds')?.value));

        if (this.selectedImage) {
            formData.append('file', this.selectedImage);
        }

        // Imprime los campos de FormData para verificación
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        this.apiService.postAvisos(formData).subscribe({
            next: () => console.log('Tutor guardado con éxito'),
            error: (error) => console.error('Error al guardar tutor:', error)
        });
    }
}

}
