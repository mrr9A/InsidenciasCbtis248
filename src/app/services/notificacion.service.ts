import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  // Mostrar la notificación en el navegador
  mostrarNotificacion(titulo: string, cuerpo: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log(`Mostrando notificación chii: ${titulo} - ${cuerpo}`);
      new Notification(titulo, { body: cuerpo, icon: 'assets/img/insidencia.png' });
    }else {
      console.log('No se puede mostrar la notificación, permiso no concedido.');
    }
  }

  // Solicitar permiso para mostrar notificaciones
  solicitarPermiso() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      console.log('Solicitando permiso para notificaciones...');
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Permiso concedido para mostrar notificaciones.');
        } else {
          console.log('Permiso denegado para mostrar notificaciones.');
        }
      });
    }
  }
}
