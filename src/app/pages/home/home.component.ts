import { Component } from '@angular/core';
import { MenuComponent } from "../../components/menu/menu.component";
import { CardInfoAlumnoComponent } from "../../components/card-info-alumno/card-info-alumno.component";
import { HistorialComponent } from "../historial/historial.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent, CardInfoAlumnoComponent, HistorialComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
