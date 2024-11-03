import { Component } from '@angular/core';
import { ApisService } from '../../services/apis.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { onTimeService } from '../../services/actulizarInfor.service';

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

  constructor(private apiService: ApisService, private router: Router, private onTimeService : onTimeService) { }

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
            const rol_tutor = usuarioEncontrado.responsable != null ? usuarioEncontrado.responsable.rol.nombre : null;
            const rol_admin = usuarioEncontrado.administrativo != null ? usuarioEncontrado.administrativo.rol.nombre : null;

            setInterval(() => {
              this.onTimeService.getActualUser();
            }, 180000);

            if (rol_tutor === 'Tutor') {
              this.router.navigate(['cbtis248/home']);
            } else if (rol_admin === 'Admin') {
              this.router.navigate(['cbtis248/homeAdmin']);
            } else if (rol_admin === 'Maestro') {
              this.router.navigate(['cbtis248/homeAdmin']);
            } else if (rol_admin === 'Prefecto') {
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

/*   async getActualUser() {
    const data = localStorage.getItem('usuario') || '{}';
    const actualUser = JSON.parse(data);

    this.apiService.getUsuarios().subscribe((usuarios: any[]) => {
      console.log('recargando Informacion');

      const usuarioAutenticadoId = actualUser?.id;
      const usuarioEncontrado = usuarios.find(usuario => usuario.id === usuarioAutenticadoId);

      if (usuarioEncontrado) {
        console.log('Información del usuario encontrado:', usuarioEncontrado);
        // Guardar la información del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
      } else {
        console.log('Usuario no encontrado en la lista.');
      }
    });
  } */

}
