import { Component } from '@angular/core';
import { onTimeService } from '../../../../services/actulizarInfor.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../../../services/apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuAdminComponent } from '../../menu-admin/menu-admin.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-aviso',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, MenuAdminComponent, MatSelectModule, MatCheckboxModule],

  templateUrl: './edit-aviso.component.html',
  styleUrl: './edit-aviso.component.css'
})
export class EditAvisoComponent {
  itemForm: FormGroup;
  grupos: any[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  avisoId: number | null = null;
  aviso: any;

  constructor(
    private onTimeService: onTimeService,
    private fb: FormBuilder,
    private apiService: ApisService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      img: ['placeholder', Validators.required],
      file: [],
      administrativoId: [],
      folder: ['avisos', Validators.required],
      grupoIds: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.cargarGrupos();
    this.cargarAviso();
  }

  cargarGrupos(): void {
    this.apiService.getGrupos().subscribe({
      next: (data: any[]) => {
        this.grupos = data;

        // Si ya se ha cargado el aviso, añade solo los grupos que no están asignados
        const assignedIds = this.aviso?.grupos?.map((ar: any) => ar.id) || [];
        this.grupos
          .filter((grupo) => !assignedIds.includes(grupo.id))
          .forEach((grupo) => {
            this.avisosFormArray.push(
              this.fb.group({
                id: grupo.id,
                grupo: grupo.grupo,
                grado: grupo.grado,
                especialidad: grupo.especialidad,
                seleccionado: false, // No asignado por defecto
              })
            );
          });
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
      },
    });
  }

  cargarAviso(): void {
    const avisoId = this.route.snapshot.paramMap.get('id');
    if (avisoId) {
      this.apiService.getAvisoById(avisoId).subscribe({
        next: (data) => {
          this.aviso = data;

          // Rellenar los campos básicos del formulario
          this.itemForm.patchValue({
            nombre: this.aviso.nombre,
            descripcion: this.aviso.descripcion,
            img: this.aviso.img,
          });

          // Procesar grupos asignados y añadirlos al FormArray
          this.aviso.grupos.forEach((ar: any) => {
            this.avisosFormArray.push(
              this.fb.group({
                id: ar.id,
                grupo: ar.grupo,
                grado: ar.grado,
                especialidad: ar.especialidad,
                seleccionado: true, // Indica que ya está asignado
              })
            );
          });

          // Mostrar la previsualización de la imagen
          this.imagePreview = this.aviso.img;
        },
        error: (error) => {
          console.error('Error al cargar aviso:', error);
        },
      });
    }
  }


  // Acceso rápido al FormArray de alumnos
  get avisosFormArray(): FormArray {
    return this.itemForm.get('grupoIds') as FormArray;
  }

  onGrupoChange(event: any): void {
    const gruposIds = this.itemForm.get('grupoIds') as FormArray;
    gruposIds.clear();

    event.value.forEach((grupoId: number) => {
      gruposIds.push(this.fb.control(grupoId));
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
        alert('Por favor, selecciona un archivo de imagen válido (JPG, JPEG, PNG)');
        return;
      }

      this.selectedImage = selectedFile;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onSubmit(): void {
    if (this.itemForm.invalid) return;

    this.isLoading = true;
    const formData = new FormData();
    const avisoId = this.route.snapshot.paramMap.get('id'); // ID del aviso a editar

    if (!avisoId) {
      // Maneja el caso en el que no se pasa un ID válido
      this.snackBar.open('ID de aviso no válido', 'Cerrar', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    const usuarioEncontrado = JSON.parse(localStorage.getItem('usuario') || '{}');
    const administrativoId = usuarioEncontrado?.administrativo?.id;

    formData.append('nombre', this.itemForm.get('nombre')?.value);
    formData.append('descripcion', this.itemForm.get('descripcion')?.value);
    const grupoIdsValue = this.itemForm.get('grupoIds')?.value;
    const grupoIds = grupoIdsValue.map((grupo: any) => grupo.id); // Asegúrate de extraer los IDs correctos

    formData.append('grupoIds', JSON.stringify(grupoIds));

    formData.append('folder', this.itemForm.get('folder')?.value);

    if (administrativoId) {
      formData.append('administrativoId', administrativoId.toString());
    }
    if (this.selectedImage) {
      formData.append('file', this.selectedImage);
    }

    // Actualiza el aviso
    this.apiService.UpdateAviso(avisoId, formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Aviso actualizado con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/cbtis248/listAvisos']);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(`Error al actualizar aviso: ${error.message}`, 'Cerrar', { duration: 3000 });
        console.error('Error al actualizar aviso:', error);
      }
    });
  }


}
