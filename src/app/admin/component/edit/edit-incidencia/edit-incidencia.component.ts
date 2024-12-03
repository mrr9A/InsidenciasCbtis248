import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../../../services/apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MenuAdminComponent } from '../../menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-incidencia',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, MenuAdminComponent, MatSelectModule, MatCheckboxModule],
  templateUrl: './edit-incidencia.component.html',
  styleUrl: './edit-incidencia.component.css'
})
export class EditIncidenciaComponent {
  incidenciaForm: FormGroup;
  alumnos: any[] = [];
  grupos: any[] = [];
  tiposIncidencia: any[] = [];
  isLoading = false;
  imagePreview: string | null = null;
  selectedImage: File | null = null;
  incidenciaId: number | null = null;
  inci: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApisService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.incidenciaForm = this.fb.group({
      tipo_incidencia_id: [null, Validators.required],
      descripcion: ['', Validators.required],
      alumno_id: [null, Validators.required],
      grupo_id: [null, Validators.required],
      fecha: [''], // Campo opcional
      file: [null],
      folder: ['incidencias', Validators.required],
      img: ['placeholder', Validators.required],
    });
  }

  ngOnInit(): void {
    this.incidenciaId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarGrupos();
    this.cargarTiposIncidencia();

    if (this.incidenciaId) {
      this.cargarIncidencia(this.incidenciaId);
    }

    // Actualiza alumnos cuando se selecciona un grupo
    this.incidenciaForm.get('grupo_id')?.valueChanges.subscribe((grupoId) => {
      this.cargarAlumnosPorGrupo(grupoId);
    });
  }

  cargarGrupos(): void {
    this.apiService.getGrupos().subscribe({
      next: (data) => (this.grupos = data),
      error: (error) => console.error('Error al cargar grupos:', error),
    });
  }

  cargarTiposIncidencia(): void {
    this.apiService.getIncidencia().subscribe({
      next: (data: any) => {
        console.log(data, 'HOLA'); // Revisa si `data` es un arreglo
        this.tiposIncidencia = data; // Asegúrate de que `data` sea un arreglo
      },
      error: (error) => {
        console.error('Error al cargar tipos de incidencia:', error);
      }
    });

  }

  cargarAlumnosPorGrupo(grupoId: number): void {
    const grupoSeleccionado = this.grupos.find((grupo) => grupo.id === grupoId);
    this.alumnos = grupoSeleccionado?.alumnos || [];
  }

  cargarIncidencia(id: number): void {
    this.apiService.getInsideById1(id).subscribe({
      next: (data) => {
        this.inci = data;
        this.incidenciaForm.patchValue({
          grupo_id: this.inci.grupo.id,
          alumno_id: this.inci.alumno.id,
          descripcion: this.inci.descripcion,
          tipo_incidencia_id: this.inci.tipo_incidencia.id
        });
        this.imagePreview = data.img; // Muestra la imagen actual
      },
      error: (error) => {
        console.error('Error al cargar incidencia:', error);
        this.snackBar.open('Error al cargar la incidencia', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/cbtis248/listIncidencias']);
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.incidenciaForm.valid && this.incidenciaId && !this.isLoading) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('tipo_incidencia_id', this.incidenciaForm.get('tipo_incidencia_id')?.value);
      formData.append('descripcion', this.incidenciaForm.get('descripcion')?.value);
      formData.append('alumno_id', this.incidenciaForm.get('alumno_id')?.value);
      /*       formData.append('grupo_id', this.incidenciaForm.get('grupo_id')?.value); */
      formData.append('grupo_id', this.incidenciaForm.get('grupo_id')?.value);
      formData.append('fecha', this.incidenciaForm.get('fecha')?.value);
      formData.append('folder', this.incidenciaForm.get('folder')?.value);
      formData.append('img', this.incidenciaForm.get('img')?.value);

      if (this.selectedImage) {
        formData.append('file', this.selectedImage);
      }
      console.log('ID QUE MANDO',this.incidenciaForm.get('grupo_id')?.value);

            this.apiService.updateIncidencia(this.incidenciaId, formData).subscribe({
              next: () => {
                this.isLoading = false;
                this.snackBar.open('Incidencia actualizada con éxito', 'Cerrar', { duration: 3000 });
                this.router.navigate(['/cbtis248/listIncidencias']);
              },
              error: (error) => {
                this.isLoading = false;
                console.error('Error al actualizar incidencia:', error);
                this.snackBar.open('Error al actualizar incidencia', 'Cerrar', { duration: 3000 });
              },
            });
    }
  }
}
