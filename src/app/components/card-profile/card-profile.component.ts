import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { onTimeService } from '../../services/actulizarInfor.service';

@Component({
  selector: 'app-card-profile',
  standalone: true,
  imports: [],
  templateUrl: './card-profile.component.html',
  styleUrl: './card-profile.component.css'
})
export class CardProfileComponent {

  usuario: any;
  correo: string = '';
  password: string = '';
  telefono: string = '';
  tipoPerfil: string = '';

  constructor(private onTimeService : onTimeService,private router: Router) {}

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
      console.log(this.usuario);

      // Asigna los datos a las variables para mostrarlos en el HTML
      this.correo = this.usuario.responsable?.correo_electronico || '';
      this.password = this.usuario.password || '';
      this.telefono = this.usuario.responsable?.num_telefono || '';
      this.tipoPerfil = this.usuario.responsable?.rol?.nombre || 'Responsable';
    }
  }

  logout() {
    // Limpia el localStorage y redirige al usuario a la página de login
    localStorage.clear();
    this.router.navigate(['cbtis248/login']); // Ajusta la ruta de acuerdo a tu configuración
  }

}
