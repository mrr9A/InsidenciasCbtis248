import { Component } from '@angular/core';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { onTimeService } from '../../../services/actulizarInfor.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cards-add',
  standalone: true,
  imports: [MenuAdminComponent,CommonModule,RouterModule,],
  templateUrl: './cards-add.component.html',
  styleUrl: './cards-add.component.css'
})
export class CardsAddComponent {

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
