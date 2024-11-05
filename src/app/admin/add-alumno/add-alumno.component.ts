import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { onTimeService } from '../../services/actulizarInfor.service';

@Component({
  selector: 'app-add-alumno',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, NgSelectModule, MatSelectModule,MenuAdminComponent],
  templateUrl: './add-alumno.component.html',
  styleUrl: './add-alumno.component.css'
})
export class AddAlumnoComponent {


  alumnoForm: FormGroup;
  grupos: any[] = [];
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imagePreview: string | null = null; // Para almacenar la URL de la imagen para la previsualización

  constructor(private onTimeService : onTimeService,private fb: FormBuilder, private apiService: ApisService) {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      num_telefono: ['', Validators.required],
      num_control_escolar: ['', Validators.required],
      file: [],
      folder: ['alumnos',Validators.required], // Campo para la imagen
      imagen_perfil: ['placeholder',Validators.required], // Campo para la imagen
      grupoId: [, Validators.required],
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
    this.loadRoles();
  }

  loadRoles() {
    this.apiService.getGrupos().subscribe({
      next: (grupos: any[]) => {
        this.grupos = grupos;
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
      if (this.alumnoForm.valid) {
  /*       const alumnoIds = this.tutorForm.get('alumnoIds')?.value;
        console.log(alumnoIds); */

          const formData = new FormData();

          formData.append('nombre', this.alumnoForm.get('nombre')?.value);
          formData.append('apellido_paterno', this.alumnoForm.get('apellido_paterno')?.value);
          formData.append('apellido_materno', this.alumnoForm.get('apellido_materno')?.value);
          formData.append('correo_electronico', this.alumnoForm.get('correo_electronico')?.value);
          formData.append('num_telefono', this.alumnoForm.get('num_telefono')?.value);
          formData.append('num_control_escolar', this.alumnoForm.get('num_control_escolar')?.value);
          formData.append('grupoId', this.alumnoForm.get('grupoId')?.value);
          formData.append('folder', this.alumnoForm.get('folder')?.value);
          formData.append('imagen_perfil', this.alumnoForm.get('imagen_perfil')?.value);

          if (this.selectedImage) {
              formData.append('file', this.selectedImage);
          }

          // Imprime los campos de FormData para verificación
          formData.forEach((value, key) => {
              console.log(key, value);
          });

          this.apiService.postAlumnos(formData).subscribe({
              next: () => console.log('Alumno guardado con éxito'),
              error: (error) => console.error('Error al guardar alumno:', error)
          });
      }
  }


}
