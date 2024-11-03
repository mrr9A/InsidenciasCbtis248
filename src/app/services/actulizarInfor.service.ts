import { Injectable } from '@angular/core';
import { ApisService } from './apis.service';

@Injectable({
  providedIn: 'root'
})
export class onTimeService {

  constructor(private apiService: ApisService) { }

   getActualUser() {
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
  }

}
