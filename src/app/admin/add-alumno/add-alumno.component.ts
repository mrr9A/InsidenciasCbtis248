import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { onTimeService } from '../../services/actulizarInfor.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-alumno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule, MatSelectModule, MenuAdminComponent, MatProgressSpinnerModule],
  templateUrl: './add-alumno.component.html',
  styleUrl: './add-alumno.component.css'
})
export class AddAlumnoComponent {


  alumnoForm: FormGroup;
  grupos: any[] = [];
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imagePreview: string | null = null; // Para almacenar la URL de la imagen para la previsualización
  isLoading = false;  // Variable para controlar el estado de carga

  constructor(private onTimeService: onTimeService, private fb: FormBuilder, private apiService: ApisService, private snackBar: MatSnackBar,private router: Router) {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      num_telefono: ['', Validators.required],
      num_control_escolar: ['', Validators.required],
      file: [],
      folder: ['alumnos', Validators.required], // Campo para la imagen
      imagen_perfil: ['placeholder', Validators.required], // Campo para la imagen
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
      this.isLoading = true;  // Activar el spinner al iniciar la petición
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

      this.apiService.postAlumnos(formData).subscribe({
        next: () => {
          this.isLoading = false;  // Desactivar el spinner al finalizar
          this.snackBar.open('Alumno registrado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/cbtis248/listAlumnos']); // Cambia '/ruta/lista-responsables' por tu ruta real
        },
        error: (error) => {
          this.isLoading = false;  // Desactivar el spinner en caso de error
          this.snackBar.open(`Error al guardar alumno: ${error.message}`, 'Cerrar', { duration: 3000 });
          console.error('Error al guardar alumno:', error);
        }
      });
    }
  }


}
