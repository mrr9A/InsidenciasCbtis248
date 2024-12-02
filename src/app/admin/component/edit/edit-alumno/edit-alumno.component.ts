import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApisService } from '../../../../services/apis.service';
import { CommonModule } from '@angular/common';
import { MenuAdminComponent } from '../../menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-alumno',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, MenuAdminComponent, MatSelectModule],
  templateUrl: './edit-alumno.component.html',
  styleUrl: './edit-alumno.component.css'
})
export class EditAlumnoComponent {

  alumnoForm: FormGroup;
  grupos: any[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  alumno: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApisService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.nullValidator],
      correo_electronico: ['', [Validators.required, Validators.email]],
      num_telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      num_control_escolar: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      file: [null],
      folder: ['alumnos', Validators.required],
      grupoId: [, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGrupos();
    this.loadAlumno();
  }

  loadGrupos() {
    this.apiService.getGrupos().subscribe({
      next: (grupos: any[]) => {
        this.grupos = grupos;
      },
      error: (error) => console.error('Error al cargar grupos:', error)
    });
  }

  loadAlumno() {
    const alumnoId = this.route.snapshot.paramMap.get('id');
    if (alumnoId) {
      this.apiService.getAlumnoById(alumnoId).subscribe({
        next: (data) => {
          this.alumno = data;
          this.alumnoForm.patchValue({
            nombre: this.alumno.nombre,
            apellido_paterno: this.alumno.apellido_paterno,
            apellido_materno: this.alumno.apellido_materno,
            correo_electronico: this.alumno.correo_electronico,
            num_telefono: this.alumno.num_telefono,
            num_control_escolar: this.alumno.num_control_escolar,
            grupoId: this.alumno.grupo.id
          });
          this.imagePreview = this.alumno.imagen_perfil;
        },
        error: (err) => {
          console.error('Error al cargar los datos del alumno', err);
        }
      });
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.alumnoForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Usamos FormData para incluir tanto el archivo como los datos del formulario
    const formData = new FormData();

    // Agregar todos los campos del formulario a FormData
    for (const key in this.alumnoForm.value) {
      if (this.alumnoForm.value.hasOwnProperty(key)) {
        formData.append(key, this.alumnoForm.value[key]);
      }
    }

    // Si se seleccionó un archivo, lo agregamos al FormData
    if (this.selectedImage) {
      console.log('Archivo seleccionado:', this.selectedImage);
      formData.append('file', this.selectedImage);
    } else {
      // Si no se seleccionó una imagen, enviamos la URL de la imagen actual como cadena
      // Si no se seleccionó una imagen, enviamos la URL de la imagen actual como cadena
      formData.append('imagen_perfil', this.alumno.imagen_perfil || '');  // Aseguramos que sea una cadena
      console.log('No se ha seleccionado un archivo de imagen. Usando la imagen actual:', this.alumno.imagen_perfil);
    }

    // Realizar la llamada para actualizar el alumno
    this.apiService.updateAlumno(this.alumno.id, formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Alumno actualizado exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/cbtis248/listAlumnos']);
      },
      error: (error) => {
        console.error('Error al actualizar el alumno:', error);
        this.isLoading = false;
        this.snackBar.open('Error al actualizar el alumno', 'Cerrar', { duration: 3000 });
      }
    });
  }



}
