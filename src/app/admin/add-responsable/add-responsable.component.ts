import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { onTimeService } from '../../services/actulizarInfor.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-add-responsable',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule, MatSelectModule, MenuAdminComponent, MatProgressSpinnerModule],
  templateUrl: './add-responsable.component.html',
  styleUrl: './add-responsable.component.css'
})
export class AddResponsableComponent {

  tutorForm: FormGroup;
  alumnos: any[] = []; // Lista para almacenar los alumnos obtenidos
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imagePreview: string | null = null; // Para almacenar la URL de la imagen para la previsualización
  isLoading = false;  // Variable para controlar el estado de carga

  constructor(private fb: FormBuilder, private apiService: ApisService, private onTimeService: onTimeService, private router: Router, private snackBar: MatSnackBar) {
    this.tutorForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      num_telefono: ['', Validators.required],
      rolId: [1, Validators.required],  // Campo opcional para rol
      password: ['', Validators.required],
      alumnoIds: this.fb.array([], Validators.required),  // Permitir selección múltiple
      file: [],// Campo para la imagen
      folder: ['tutors', Validators.required], // Campo para la imagen
      img: ['placeholder', Validators.required] // Campo para la imagen
    });
  }

  ngOnInit(): void {
    this.cargarAlumnos();
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
  }

  cargarAlumnos(): void {
    this.apiService.getAlumnos().subscribe({
      next: (data: any) => {
        this.alumnos = data;
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
      }
    });
  }

  onAlumnoChange(event: any): void {
    const alumnoIdsArray = this.tutorForm.get('alumnoIds') as FormArray;
    alumnoIdsArray.clear(); // Limpiar el array antes de añadir nuevos valores

    // Aquí, `event.value` debe ser un array de los IDs seleccionados
    event.value.forEach((alumnoId: number) => {
      alumnoIdsArray.push(this.fb.control(alumnoId)); // Asegúrate de que aquí agregas el control correctamente
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
    if (this.tutorForm.valid) {
      this.isLoading = true;  // Activar el spinner al iniciar la petición
      const formData = new FormData();

      formData.append('nombre', this.tutorForm.get('nombre')?.value);
      formData.append('apellido_paterno', this.tutorForm.get('apellido_paterno')?.value);
      formData.append('apellido_materno', this.tutorForm.get('apellido_materno')?.value);
      formData.append('correo_electronico', this.tutorForm.get('correo_electronico')?.value);
      formData.append('num_telefono', this.tutorForm.get('num_telefono')?.value);
      formData.append('rolId', this.tutorForm.get('rolId')?.value);
      formData.append('password', this.tutorForm.get('password')?.value);
      formData.append('folder', this.tutorForm.get('folder')?.value);
      formData.append('img', this.tutorForm.get('img')?.value);
      formData.append('alumnoIds', JSON.stringify(this.tutorForm.get('alumnoIds')?.value));

      if (this.selectedImage) {
        formData.append('file', this.selectedImage);
      }


      this.apiService.postTutor(formData).subscribe({
        next: () => {
          this.isLoading = false;  // Desactivar el spinner al finalizar
          this.snackBar.open('Tutor registrado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/cbtis248/listResponsable']); // Cambia '/ruta/lista-responsables' por tu ruta real
        },
        error: (error) => {
          this.isLoading = false;  // Desactivar el spinner en caso de error
          this.snackBar.open(`Error al guardar tutor: ${error.message}`, 'Cerrar', { duration: 3000 });
          console.error('Error al guardar tutor:', error);
        }
      });
    }
  }


}



