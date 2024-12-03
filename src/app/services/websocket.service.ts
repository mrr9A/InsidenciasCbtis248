import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { NotificationService } from './notificacion.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;
  private responsableId: string | null = null;

  constructor(private notificationService: NotificationService) {
/*         this.socket = io('http://localhost:3000'); // URL de tu servidor de WebSockets */
    this.socket = io('https://cbtis248back.onrender.com'); // URL de tu servidor de WebSockets
  }

  // Conectar al WebSocket con el ID del responsable
  conectar(responsableId: string) {
    this.socket.emit('registrar-responsable', responsableId);

    this.socket.on(`notificacion-${responsableId}`, (mensaje: any) => {
      // Este bloque gestiona la notificación
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(mensaje.titulo, {
            body: mensaje.descripcion,
            icon: 'assets/img/insidencia.png',
            data: { url: `/cbtis248/avisos` },
          });
        });
      }
    });

  }

  // Escuchar eventos de WebSocket para notificaciones
  escucharNotificaciones() {
    if (this.responsableId) {
      this.socket.on(`notificacion-${this.responsableId}`, (mensaje: any) => {
        // Mostrar la notificación cuando llega un mensaje
        this.notificationService.mostrarNotificacion(mensaje.titulo, mensaje.descripcion);
      });
    }
  }
}
