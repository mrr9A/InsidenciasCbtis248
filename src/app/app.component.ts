import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,HttpClientModule,MatSnackBarModule,MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'IncidenciasCbtis248';
  deferredPrompt: any;  // Variable para almacenar el evento de instalación
  showInstallPrompt: boolean = false;  // Controla si mostramos el botón

  constructor() {
    // Escucha el evento 'beforeinstallprompt'
    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallPrompt = true;  // Muestra el botón de instalación
    });

    // Escucha si la app ya fue instalada
    window.addEventListener('appinstalled', () => {
      console.log('PWA fue instalada');
      this.showInstallPrompt = false;  // Oculta el botón de instalación
    });
  }

  // Método para manejar el clic en el botón de instalación
  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();  // Muestra el prompt nativo
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó instalar la PWA');
        } else {
          console.log('El usuario rechazó la instalación');
        }
        this.deferredPrompt = null;  // Limpia el prompt almacenado
        this.showInstallPrompt = false;  // Oculta el botón de instalación
      });
    }
  }
}
