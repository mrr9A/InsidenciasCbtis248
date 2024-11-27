import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CargaMasivaService } from '../services/carga-masiva.service';
import { MenuAdminComponent } from '../admin/component/menu-admin/menu-admin.component';

@Component({
  selector: 'app-carga-masiva',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MenuAdminComponent],
  templateUrl: './carga-masiva.component.html',
  styleUrl: './carga-masiva.component.css'
})
export class CargaMasivaComponent {
  /*   form: FormGroup;

    constructor(private fb: FormBuilder, private http: HttpClient, private cargaMasivaService: CargaMasivaService) {
      this.form = this.fb.group({
        file: [null] // Campo para el archivo
      });
    }

    onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.form.patchValue({ file });
      }
    }

    uploadFile() {
      const file = this.form.get('file')?.value;
      if (file) {
        this.cargaMasivaService.uploadFile(file).subscribe({
          next: (response) => {
            console.log('Carga exitosa:', response); // Mostrará el texto del backend
            alert(response); // Muestra el mensaje recibido
          },
          error: (err) => {
            console.error('Error en la carga:', err);
            alert('Error en la carga: ' + (err.error || 'Ocurrió un error desconocido'));
          }
        });
      } else {
        alert('Por favor, selecciona un archivo antes de cargar.');
      }
    } */

/*   form: FormGroup;
  loading: boolean = false; // Estado de carga
  successMessage: string = ''; // Mensaje de éxito

  constructor(private fb: FormBuilder, private http: HttpClient, private cargaMasivaService: CargaMasivaService) {
    this.form = this.fb.group({
      file: [null] // Campo para el archivo
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ file });
    }
  }

  uploadFile() {
    const file = this.form.get('file')?.value;
    if (file) {
      this.loading = true; // Mostrar el spinner
      this.successMessage = ''; // Limpiar mensaje anterior

      this.cargaMasivaService.uploadFile(file).subscribe({
        next: (response) => {
          console.log('Carga exitosa:', response); // Mostrar respuesta del backend
          this.successMessage = 'Información cargada con éxito'; // Mostrar mensaje de éxito
        },
        error: (err) => {
          console.error('Error en la carga:', err);
          alert('Error en la carga: ' + (err.error || 'Ocurrió un error desconocido'));
        },
        complete: () => {
          this.loading = false; // Ocultar el spinner al finalizar
        }
      });
    } else {
      alert('Por favor, selecciona un archivo antes de cargar.');
    }
  } */

    form: FormGroup;
    loading: boolean = false; // Estado del spinner
    successMessage: string = ''; // Mensaje de éxito
    errorMessage: string = ''; // Mensaje de error

    constructor(private fb: FormBuilder, private cargaMasivaService: CargaMasivaService) {
      this.form = this.fb.group({
        file: [null], // Campo para el archivo
      });
    }

    onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.form.patchValue({ file });
      }
    }

    uploadFile() {
      const file = this.form.get('file')?.value;
      if (file) {
        this.loading = true; // Mostrar el spinner
        this.successMessage = ''; // Limpiar mensaje de éxito anterior
        this.errorMessage = ''; // Limpiar mensaje de error anterior

        this.cargaMasivaService.uploadFile(file).subscribe({
          next: (response) => {
            console.log('Carga exitosa:', response);
            this.successMessage = 'Información cargada con éxito'; // Mostrar mensaje de éxito
            this.loading = false;
          },
          error: (err) => {
            console.error('Error en la carga:', err);
            this.errorMessage = 'Error en la carga: ' + (err.error?.message || 'Ocurrió un error desconocido');
            alert(this.errorMessage); // Mostrar alerta con el error
            this.loading = false;
          },
          complete: () => {
            this.loading = false; // Asegurar que el spinner se oculte siempre
          }
        });
      } else {
        alert('Por favor, selecciona un archivo antes de cargar.');
      }
    }
}
