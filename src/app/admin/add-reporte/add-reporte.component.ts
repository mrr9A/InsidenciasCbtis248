import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { onTimeService } from '../../services/actulizarInfor.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './add-reporte.component.html',
  styleUrl: './add-reporte.component.css'
})
export class AddReporteComponent {
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imagePreview: string | null = null; // Para almacenar la URL de la imagen para la previsualización
  incidenciaForm: FormGroup;
  alumnos: any[] = []; // Lista de alumnos a mostrar
  grupos: any[] = [];  // Lista de grupos obtenidos
  tiposIncidencia: any[] = [];  // Lista de tipos de incidencia obtenidos
  isLoading = false; // Variable para controlar el estado de carga

  constructor(private onTimeService: onTimeService, private fb: FormBuilder, private apiService: ApisService, private snackBar: MatSnackBar, private router: Router,private http: HttpClient) {
    this.incidenciaForm = this.fb.group({
      tipo_incidencia_id: [, Validators.required],
      descripcion: ['', Validators.required],
      alumno_id: [, Validators.required],
      grupo_id: [, Validators.required],
      fecha: [''],  // Campo opcional
      file: [,Validators.required],
      folder: ['insidencias', Validators.required],
      img: ['placeholder', Validators.required],
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const selectedFile = input.files[0]; // Archivo seleccionado

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
        alert('Por favor, selecciona un archivo de imagen válido (JPG, JPEG, PNG)');
        return; // No proceder con la carga si el archivo no es válido
      }

      this.selectedImage = selectedFile; // Guarda el archivo de imagen

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Almacena la URL de la imagen
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }


  ngOnInit(): void {
/*     setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000); */
    this.cargarGrupos();
    this.cargarTiposIncidencia();

    // Escucha los cambios en el campo grupo_id
    this.incidenciaForm.get('grupo_id')?.valueChanges.subscribe((grupoId) => {
      this.cargarAlumnosPorGrupo(grupoId);
    });
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

  cargarTiposIncidencia(): void {
    this.apiService.getIncidencia().subscribe({
      next: (data: any) => {
        this.tiposIncidencia = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de incidencia:', error);
      }
    });
  }

  cargarAlumnosPorGrupo(grupoId: number): void {
    const grupoSeleccionado = this.grupos.find(grupo => grupo.id === grupoId);
    if (grupoSeleccionado && grupoSeleccionado.alumnos.length > 0) {
      this.alumnos = grupoSeleccionado.alumnos;
    } else {
      this.alumnos = []; // Limpia la lista si no hay alumnos
      this.incidenciaForm.get('alumno_id')?.reset(); // Resetea el valor del select de alumnos
    }
  }

  onSubmit(): void {
    if (this.incidenciaForm.valid && !this.isLoading) {
      this.isLoading = true; // Activa el spinner para evitar múltiples envíos

      // Agregar la fecha actual si no se ha proporcionado
      if (!this.incidenciaForm.get('fecha')?.value) {
        const fechaActual = new Date().toISOString().split('T')[0];
        this.incidenciaForm.get('fecha')?.setValue(fechaActual);
      }

      // Crear un objeto FormData para el envío del formulario
      const formData = new FormData();

      // Verificar si hay una imagen seleccionada
      if (this.selectedImage) {
        formData.append('file', this.selectedImage); // Imagen seleccionada por el usuario
      }

      // Agregar el resto de los campos al FormData
      formData.append('tipo_incidencia_id', this.incidenciaForm.get('tipo_incidencia_id')?.value);
      formData.append('descripcion', this.incidenciaForm.get('descripcion')?.value);
      formData.append('alumno_id', this.incidenciaForm.get('alumno_id')?.value);
      formData.append('grupo_id', this.incidenciaForm.get('grupo_id')?.value);
      formData.append('fecha', this.incidenciaForm.get('fecha')?.value);
      formData.append('folder', this.incidenciaForm.get('folder')?.value);
      formData.append('img', this.incidenciaForm.get('img')?.value);

      // Extraer el ID del administrativo del localStorage
      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
      const administrativoId = usuarioGuardado.administrativo?.id;
      if (administrativoId) {
        formData.append('administrativo_id', administrativoId.toString());
      }

      // Enviar los datos al backend
      this.apiService.postIncidencia(formData).subscribe({
        next: () => {
          this.isLoading = false; // Desactiva el spinner
          this.incidenciaForm.reset(); // Limpia el formulario
          this.snackBar.open('Incidencia guardada con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/cbtis248/listIncidencias']); // Navega a la lista de incidencias
        },
        error: (error) => {
          this.isLoading = false; // Desactiva el spinner
          this.snackBar.open(`Error al guardar incidencia: ${error.error.message || error.message}`, 'Cerrar', { duration: 3000 });
          console.error('Error al guardar incidencia:', error);
        }
      });
    }
  }
}
