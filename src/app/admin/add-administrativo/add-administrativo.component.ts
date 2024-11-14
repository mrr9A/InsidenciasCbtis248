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
  selector: 'app-add-administrativo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule, MatSelectModule, MenuAdminComponent, MatProgressSpinnerModule],
  templateUrl: './add-administrativo.component.html',
  styleUrl: './add-administrativo.component.css'
})
export class AddAdministrativoComponent {

  administrativoForm: FormGroup;
  roles: any[] = [];
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imagePreview: string | null = null; // Para almacenar la URL de la imagen para la previsualización
  isLoading = false;  // Variable para controlar el estado de carga
  isSubmitted = false; // Nuevo campo para evitar el doble envío

  constructor(private onTimeService: onTimeService, private fb: FormBuilder, private apiService: ApisService, private snackBar: MatSnackBar, private router: Router) {
    this.administrativoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      num_telefono: ['', Validators.required],
      file: [],
      folder: ['administrativos', Validators.required], // Campo para la imagen
      img: ['placeholder', Validators.required], // Campo para la imagen
      rolId: [, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
    this.loadRoles();
  }

  loadRoles() {
    this.apiService.getRoles().subscribe({
      next: (roles: any[]) => {
        this.roles = roles;
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
    if (this.administrativoForm.valid && !this.isSubmitted) {
      this.isLoading = true;
      this.isSubmitted = true; // Marcar como enviado

      const formData = new FormData();
      formData.append('nombre', this.administrativoForm.get('nombre')?.value);
      formData.append('apellido_paterno', this.administrativoForm.get('apellido_paterno')?.value);
      formData.append('apellido_materno', this.administrativoForm.get('apellido_materno')?.value);
      formData.append('correo_electronico', this.administrativoForm.get('correo_electronico')?.value);
      formData.append('num_telefono', this.administrativoForm.get('num_telefono')?.value);
      formData.append('rolId', this.administrativoForm.get('rolId')?.value);
      formData.append('password', this.administrativoForm.get('password')?.value);
      formData.append('folder', this.administrativoForm.get('folder')?.value);
      formData.append('img', this.administrativoForm.get('img')?.value);

      if (this.selectedImage) {
        formData.append('file', this.selectedImage);
      }

      this.apiService.postAdministrativos(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.isSubmitted = false; // Restablecer después de la respuesta
          this.snackBar.open('Administrativo registrado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/cbtis248/listAdministrativos']);
        },
        error: (error) => {
          this.isLoading = false;
          this.isSubmitted = false; // Restablecer en caso de error
          this.snackBar.open(`Error al guardar Administrativo: ${error.message}`, 'Cerrar', { duration: 3000 });
          console.error('Error al guardar Administrativo:', error);
        }
      });
    }
  }
}
