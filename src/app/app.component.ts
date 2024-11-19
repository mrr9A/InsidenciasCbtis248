import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WebSocketService } from './services/websocket.service';
import { NotificationService } from './services/notificacion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IncidenciasCbtis248';
  deferredPrompt: any;  // Variable para almacenar el evento de instalación
  showInstallPrompt: boolean = false;  // Controla si mostramos el botón
  responsableId: number | null = null; // ID del responsable, puede ser null

  constructor(
    private webSocketService: WebSocketService,
    private notificationService: NotificationService // Inyectamos el servicio de notificaciones
  ) {
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

  ngOnInit() {
    // Obtener el objeto del usuario desde el localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    // Verificar si existe un responsable
    if (usuario.responsable) {
      this.responsableId = usuario.responsable.id;
    } else {
      console.log('No se encontró un responsable.');
    }

    // Solicitar permiso para mostrar notificaciones
    this.notificationService.solicitarPermiso();

    // Si hay un responsable, conectarse al WebSocket con su ID
    if (this.responsableId) {
      this.webSocketService.conectar(this.responsableId.toString());
    } else {
      console.log('No se conectará al WebSocket porque no hay responsable.');
    }
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
