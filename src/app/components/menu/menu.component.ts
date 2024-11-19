import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { onTimeService } from '../../services/actulizarInfor.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  usuario: any;
  correo: string = '';
  password: string = '';
  telefono: string = '';
  tipoPerfil: string = '';
  constructor(private onTimeService: onTimeService) { }

  ngOnInit(): void {
    setInterval(() => {
    this.onTimeService.getActualUser();
  }, 180000);
  this.loadUsuario();
  }

  loadUsuario() {
    // Recupera el usuario desde localStorage
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
      //console.log(this.usuario);

      // Asigna los datos a las variables para mostrarlos en el HTML
      this.correo = this.usuario.responsable?.correo_electronico || '';
      this.password = this.usuario.password || '';
      this.telefono = this.usuario.responsable?.num_telefono || '';
    }
  }

}
