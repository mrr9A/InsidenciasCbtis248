import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-administrativo',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-administrativo.component.html',
  styleUrl: './add-administrativo.component.css'
})
export class AddAdministrativoComponent {

  administrativoForm: FormGroup;
  roles: any[] = [];

  constructor(private fb: FormBuilder, private apiService: ApisService) {
    this.administrativoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      num_telefono: ['', Validators.required],
      imagen_perfil: ['', Validators.required],
      rolId: [, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
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

  onSubmit() {
    if (this.administrativoForm.valid) {
      // Recoge los valores del formulario y asegura que rolId sea un número
      const administrativoData = {
        ...this.administrativoForm.value,
        rolId: Number(this.administrativoForm.value.rolId),  // Convertir rolId a entero
      };
console.log(administrativoData);

      // Llama al servicio y envía los datos en formato JSON
 /*      this.apiService.postAdministrativos(administrativoData).subscribe({
        next: () => console.log('Administrativo guardado con éxito'),
        error: (error) => console.error('Error al guardar administrativo:', error)
      }); */
    }
  }



}
