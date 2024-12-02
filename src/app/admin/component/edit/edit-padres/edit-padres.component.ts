import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from '../../../../services/apis.service';
import { onTimeService } from '../../../../services/actulizarInfor.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuAdminComponent } from '../../menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-edit-padres',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, MenuAdminComponent, MatSelectModule, MatCheckboxModule],
  templateUrl: './edit-padres.component.html',
  styleUrl: './edit-padres.component.css'
})
export class EditPadresComponent {

  tutorForm!: FormGroup;
  alumnos: any[] = []; // Lista de todos los alumnos
  tutor: any = {};
  isLoading = false;
  selectedImage: File | null = null; // Imagen seleccionada por el usuario
  imagePreview: string | null = null; // Vista previa de la imagen seleccionada

  constructor(
    private fb: FormBuilder,
    private apiService: ApisService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    // Inicializar formulario
    this.tutorForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: [''],
      num_telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      alumnos: this.fb.array([]), // FormArray para alumnos
      file: [null],
    });
  }

  ngOnInit(): void {
    this.loadResponsableData();
    this.loadAllAlumnos(); // Cargar lista completa de alumnos
  }

  // Obtener datos del responsable y sus alumnos asignados
  loadResponsableData(): void {
    const tutorId = this.route.snapshot.paramMap.get('id');
    if (tutorId) {
      this.apiService.getResponsableById(tutorId).subscribe({
        next: (data) => {
          this.tutor = data;

          // Configurar valores del formulario
          this.tutorForm.patchValue({
            nombre: this.tutor.nombre,
            apellido_paterno: this.tutor.apellido_paterno,
            apellido_materno: this.tutor.apellido_materno,
            num_telefono: this.tutor.num_telefono,
            correo_electronico: this.tutor.usuario.correo_electronico,
            password: this.tutor.usuario.password,
          });

          // Procesar alumnos asignados y añadirlos al FormArray
          this.tutor.alumnoResponsables.forEach((ar: any) => {
            this.alumnosFormArray.push(
              this.fb.group({
                id: ar.alumno.id,
                nombre: ar.alumno.nombre,
                seleccionado: true, // Indica que ya está asignado
              })
            );
          });
        },
        error: () => {
          this.snackBar.open('Error al cargar datos del responsable', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  // Maneja la selección de una imagen
  onImageSelected(event: Event): void {
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

  // Obtener todos los alumnos disponibles
  loadAllAlumnos(): void {
    this.apiService.getAlumnos().subscribe({
      next: (data: any) => {
        this.alumnos = data;

        // Añadir alumnos que no están asignados al FormArray
        const assignedIds = this.tutor.alumnoResponsables?.map((ar: any) => ar.alumno.id) || [];
        this.alumnos
          .filter((alumno) => !assignedIds.includes(alumno.id))
          .forEach((alumno) => {
            this.alumnosFormArray.push(
              this.fb.group({
                id: alumno.id,
                nombre: alumno.nombre,
                seleccionado: false, // No está asignado
              })
            );
          });
      },
      error: () => {
        this.snackBar.open('Error al cargar alumnos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  // Acceso rápido al FormArray de alumnos
  get alumnosFormArray(): FormArray {
    return this.tutorForm.get('alumnos') as FormArray;
  }

  // Enviar formulario con datos actualizados
  onSubmit(): void {
    if (this.tutorForm.invalid) return;

    this.isLoading = true;
    const formData = this.tutorForm.value;

    // Filtrar solo los alumnos seleccionados
    const selectedAlumnos = formData.alumnos.filter((a: any) => a.seleccionado);
    formData.alumnos = selectedAlumnos;


    this.apiService.updateResponsable(this.tutor.id, formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Responsable actualizado exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/cbtis248/listResponsable']);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al actualizar responsable', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
