import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { onTimeService } from '../../../../services/actulizarInfor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApisService } from '../../../../services/apis.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MenuAdminComponent } from '../../menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-administrativos',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, MenuAdminComponent, MatSelectModule, MatCheckboxModule],
  templateUrl: './edit-administrativos.component.html',
  styleUrl: './edit-administrativos.component.css'
})
export class EditAdministrativosComponent {
  administrativoForm: FormGroup;
  roles: any[] = [];
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imagePreview: string | null = null; // Para almacenar la URL de la imagen para la previsualización
  isLoading = false;  // Variable para controlar el estado de carga
  isSubmitted = false; // Nuevo campo para evitar el doble envío
  administrativoId!: number;

  constructor(
    private fb: FormBuilder,
    private apiService: ApisService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.administrativoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: [''],
      correo_electronico: ['', [Validators.required, Validators.email]],
      num_telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      file: [null],
      folder: ['administrativos'],
/*       img: ['', Validators.required], */
      rolId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.administrativoId = +this.route.snapshot.paramMap.get('id')!; // Obtener el ID de la URL
    if (this.administrativoId) {
      this.loadAdministrativoData();
    }
  }

  loadRoles() {
    this.apiService.getRoles().subscribe({
      next: (roles: any[]) => {
        this.roles = roles;
      },
      error: (error) => console.error('Error al cargar roles:', error)
    });
  }

  loadAdministrativoData() {
    this.isLoading = true;
    this.apiService.getAdminis1(this.administrativoId).subscribe({
      next: (data: any) => {
        this.administrativoForm.patchValue({
          nombre: data.nombre,
          apellido_paterno: data.apellido_paterno,
          apellido_materno: data.apellido_materno || '',
          num_telefono: data.num_telefono,
          rolId: data.rol.id,
          img: data.img || 'placeholder',
          correo_electronico: data.correo_electronico,
          password: data.usuario.password
        });
        // Establecer la imagen previa
        this.imagePreview = data.img;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar datos del administrativo:', error);
        this.snackBar.open('Error al cargar los datos del administrativo', 'Cerrar', { duration: 3000 });
      }
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
    if (this.administrativoForm.valid && !this.isSubmitted) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('nombre', this.administrativoForm.get('nombre')?.value);
      formData.append('apellido_paterno', this.administrativoForm.get('apellido_paterno')?.value);
      formData.append('apellido_materno', this.administrativoForm.get('apellido_materno')?.value);
      formData.append('correo_electronico', this.administrativoForm.get('correo_electronico')?.value);
      formData.append('num_telefono', this.administrativoForm.get('num_telefono')?.value);
      formData.append('rolId', this.administrativoForm.get('rolId')?.value);
      formData.append('password', this.administrativoForm.get('password')?.value);
      formData.append('folder', this.administrativoForm.get('folder')?.value);

      if (this.selectedImage) {
        formData.append('file', this.selectedImage);
      }

      this.apiService.getAdminis(this.administrativoId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.isSubmitted = false;
          this.snackBar.open('Administrativo actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/cbtis248/listAdministrativos']);
        },
        error: (error) => {
          this.isLoading = false;
          this.isSubmitted = false;
          this.snackBar.open(`Error al actualizar Administrativo: ${error.message}`, 'Cerrar', { duration: 3000 });
          console.error('Error al actualizar Administrativo:', error);
        }
      });
    }
  }
}
