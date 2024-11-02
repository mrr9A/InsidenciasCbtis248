import { Component } from '@angular/core';
import { MenuComponent } from "../../components/menu/menu.component";
import { CardInfoAlumnoComponent } from "../../components/card-info-alumno/card-info-alumno.component";
import { HistorialComponent } from "../historial/historial.component";
import { AvisosComponent } from "../avisos/avisos.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent, CardInfoAlumnoComponent, HistorialComponent, AvisosComponent,CommonModule,HttpClientModule],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
