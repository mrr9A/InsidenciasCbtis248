import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
      apellido_materno: ['', Validators.nullValidator],
      /*       correo_electronico: ['', [Validators.required, Validators.email]], */
      correo_electronico: ['', [
        Validators.required,
        Validators.email,
        this.correoValidator  // Custom validator para arroba y punto
      ]],
      /*       num_telefono: ['', Validators.required], */
      num_telefono: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      rolId: [1, Validators.required],  // Campo opcional para rol
      /*       password: ['', Validators.required], */
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator  // Custom validator para contraseña
      ]],
      alumnoIds: this.fb.array([], Validators.required),  // Permitir selección múltiple
      file: [, Validators.required],// Campo para la imagen
      folder: ['tutors', Validators.required], // Campo para la imagen
      img: ['placeholder', Validators.required] // Campo para la imagen
    });
  }

  // Custom validator para el correo
  correoValidator(control: FormControl): ValidationErrors | null {
    const email = control.value;
    if (email && (!email.includes('@') || !email.includes('.'))) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Custom validator para la contraseña
  passwordValidator(control: FormControl): ValidationErrors | null {
    const password = control.value;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (password && !regex.test(password)) {
      return { invalidPassword: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.cargarAlumnos();
/*     setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000); */
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
    if (this.tutorForm.valid && !this.isLoading) { // Verifica que no esté en estado de carga
      this.isLoading = true;  // Activa el spinner y evita nuevos envíos
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
          this.isLoading = false;  // Desactiva el spinner al finalizar
          this.snackBar.open('Padre de familia registrado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/cbtis248/listResponsable']); // Redirige tras éxito
        },
        error: (error) => {
          this.isLoading = false;  // Desactiva el spinner en caso de error
          this.snackBar.open(`Error al guardar tutor: ${error.message}`, 'Cerrar', { duration: 3000 });
          console.error('Error al guardar tutor:', error);
        }
      });
    }
  }


}



