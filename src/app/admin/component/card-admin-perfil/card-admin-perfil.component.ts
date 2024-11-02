import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-admin-perfil',
  standalone: true,
  imports: [],
  templateUrl: './card-admin-perfil.component.html',
  styleUrl: './card-admin-perfil.component.css'
})
export class CardAdminPerfilComponent {

  usuario: any;
  correo: string = '';
  password: string = '';
  telefono: string = '';
  tipoPerfil: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUsuario();
  }

  loadUsuario() {
    // Recupera el usuario desde localStorage
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
      console.log(this.usuario);

      // Asigna los datos a las variables para mostrarlos en el HTML
      this.correo = this.usuario.administrativo?.correo_electronico || '';
      this.password = this.usuario.password || '';
      this.telefono = this.usuario.administrativo?.num_telefono || '';
      this.tipoPerfil = this.usuario.administrativo?.rol?.nombre || 'Responsable';
    }
  }

  logout() {
    // Limpia el localStorage y redirige al usuario a la página de login
    localStorage.clear();
    this.router.navigate(['cbtis248/login']); // Ajusta la ruta de acuerdo a tu configuración
  }

}
