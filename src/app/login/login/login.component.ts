import { Component } from '@angular/core';
import { ApisService } from '../../services/apis.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    correo_electronico: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private apiService: ApisService, private router: Router) { }

  showPassword: boolean = false; // Definir la propiedad showPassword

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Cambiar entre mostrar y ocultar contraseña
  }
  onSubmit() {
    this.apiService.login(this.credentials).subscribe({
      next: (response: any) => {
        console.log('Inicio de sesión exitoso', response);
        localStorage.setItem('correo_electronico', response.correo_electronico);
        localStorage.setItem('id', response.id.toString());

        // Llamar al método getUsuarios() para filtrar
        this.apiService.getUsuarios().subscribe((usuarios: any[]) => {
          const usuarioAutenticadoId = response.id;
          const usuarioEncontrado = usuarios.find(usuario => usuario.id === usuarioAutenticadoId);

          if (usuarioEncontrado) {
            console.log('Información del usuario encontrado:', usuarioEncontrado);
            // Guardar la información del usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));

            // Redirigir según el rol
            const rol_tutor = usuarioEncontrado.responsable != null ?   usuarioEncontrado.responsable.rol.nombre : null;
            const rol_admin =  usuarioEncontrado.adminstrativo != null ?  usuarioEncontrado.responsable.rol.nombre : null;


            if (rol_tutor === 'Tutor') {
              this.router.navigate(['cbtis248/home']);
            } else if (rol_admin === 'Admin') {
              this.router.navigate(['cbtis248/homeadmin']);
            }else if (rol_admin === 'Maestro') {
              this.router.navigate(['cbtis248/homeadmin']);
            }else if (rol_admin === 'Prefecto') {
              this.router.navigate(['cbtis248/homeAdmin']);
            }
          } else {
            console.log('Usuario no encontrado en la lista.');
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Credenciales incorrectas';
        console.error('Error en el inicio de sesión', error);
      }
    });
  }

}
