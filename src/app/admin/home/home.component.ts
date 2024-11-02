import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { CardAdminPerfilComponent } from "../component/card-admin-perfil/card-admin-perfil.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuAdminComponent, CommonModule, CardAdminPerfilComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
