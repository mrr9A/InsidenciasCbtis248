import { Component } from '@angular/core';
import { ApisService } from '../../services/apis.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { onTimeService } from '../../services/actulizarInfor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    correo_electronico: '',
    password: ''
  };
  isLoading = false; // Variable para controlar el estado de carga
  errorMessage: string | null = null;

  constructor(private apiService: ApisService, private router: Router, private onTimeService: onTimeService, private snackBar: MatSnackBar) { }

  showPassword: boolean = false; // Definir la propiedad showPassword

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Cambiar entre mostrar y ocultar contraseña
  }

  onSubmit() {
    // Validar manualmente el correo electrónico
    if (!this.credentials.correo_electronico.includes('@') || !this.credentials.correo_electronico.includes('.')) {
      this.snackBar.open('El correo electrónico debe contener un "@" y un punto.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.credentials.password.length < 8) {
      this.snackBar.open('La contraseña debe tener al menos 8 caracteres.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true; // Activa el spinner

    this.apiService.login(this.credentials).subscribe({
      next: (response: any) => {
        this.isLoading = false; // Desactiva el spinner
        localStorage.setItem('correo_electronico', response.correo_electronico);
        localStorage.setItem('id', response.id.toString());

        this.apiService.getUsuarios().subscribe((usuarios: any[]) => {
          const usuarioAutenticadoId = response.id;
          const usuarioEncontrado = usuarios.find(usuario => usuario.id === usuarioAutenticadoId);

          if (usuarioEncontrado) {
            localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));

            const rol = usuarioEncontrado.responsable?.rol?.nombre || usuarioEncontrado.administrativo?.rol?.nombre;

            setInterval(() => this.onTimeService.getActualUser(), 180000);

            if (rol === 'Tutor') {
              this.router.navigate(['cbtis248/home']);
            } else if (['Admin', 'Maestro', 'Prefecto'].includes(rol)) {
              this.router.navigate(['cbtis248/homeAdmin']);
            }
          }
        });
      },
      error: (error) => {
        this.isLoading = false; // Desactiva el spinner en caso de error
        this.mostrarMensajeError(error);
      }
    });
  }


  private mostrarMensajeError(error: any) {
    let mensajeError = 'Credenciales incorrectas.';
    if (error.error.message === 'El correo electrónico es incorrecto') {
      mensajeError = 'El correo ingresado es incorrecto.';
    } else if (error.error.message === 'La contraseña es incorrecta') {
      mensajeError = 'La contraseña ingresada es incorrecta.';
    } else if (error.status === 0) {
      mensajeError = 'El servidor no está disponible.';
    }

    this.snackBar.open(mensajeError, 'Cerrar', {
      duration: 3000
    });
  }
}
