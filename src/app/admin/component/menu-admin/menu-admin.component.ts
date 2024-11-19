import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { onTimeService } from '../../../services/actulizarInfor.service';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent {

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
      this.correo = this.usuario.administrativo?.correo_electronico || '';
      this.password = this.usuario.password || '';
      this.telefono = this.usuario.administrativo?.num_telefono || '';
      this.tipoPerfil = this.usuario.administrativo?.rol?.nombre || 'Responsable';
    }
  }

}

