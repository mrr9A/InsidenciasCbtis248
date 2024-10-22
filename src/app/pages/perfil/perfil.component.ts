import { Component } from '@angular/core';
import { CardProfileComponent } from "../../components/card-profile/card-profile.component";
import { MenuComponent } from "../../components/menu/menu.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CardProfileComponent, MenuComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

}
