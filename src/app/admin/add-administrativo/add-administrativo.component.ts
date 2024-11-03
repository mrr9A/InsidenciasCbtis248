import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-administrativo',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, NgSelectModule, MatSelectModule],
  templateUrl: './add-administrativo.component.html',
  styleUrl: './add-administrativo.component.css'
})
export class AddAdministrativoComponent {

  administrativoForm: FormGroup;
  roles: any[] = [];
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imagePreview: string | null = null; // Para almacenar la URL de la imagen para la previsualización

  constructor(private fb: FormBuilder, private apiService: ApisService) {
    this.administrativoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      num_telefono: ['', Validators.required],
      file: [],
      folder: ['administrativos',Validators.required], // Campo para la imagen
      img: ['placeholder',Validators.required], // Campo para la imagen
      rolId: [, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.apiService.getRoles().subscribe({
      next: (roles: any[]) => {
        this.roles = roles;
      },
      error: (error) => console.error('Error al cargar roles:', error)
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
      if (this.administrativoForm.valid) {
  /*       const alumnoIds = this.tutorForm.get('alumnoIds')?.value;
        console.log(alumnoIds); */

          const formData = new FormData();

          formData.append('nombre', this.administrativoForm.get('nombre')?.value);
          formData.append('apellido_paterno', this.administrativoForm.get('apellido_paterno')?.value);
          formData.append('apellido_materno', this.administrativoForm.get('apellido_materno')?.value);
          formData.append('correo_electronico', this.administrativoForm.get('correo_electronico')?.value);
          formData.append('num_telefono', this.administrativoForm.get('num_telefono')?.value);
          formData.append('rolId', this.administrativoForm.get('rolId')?.value);
          formData.append('password', this.administrativoForm.get('password')?.value);
          formData.append('folder', this.administrativoForm.get('folder')?.value);
          formData.append('img', this.administrativoForm.get('img')?.value);

          if (this.selectedImage) {
              formData.append('file', this.selectedImage);
          }

          // Imprime los campos de FormData para verificación
          formData.forEach((value, key) => {
              console.log(key, value);
          });

          this.apiService.postAdministrativos(formData).subscribe({
              next: () => console.log('Administrativo guardado con éxito'),
              error: (error) => console.error('Error al guardar Administrativo:', error)
          });
      }
  }


}
