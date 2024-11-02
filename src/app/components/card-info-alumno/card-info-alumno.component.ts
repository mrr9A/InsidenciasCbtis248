import { Component } from '@angular/core';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-info-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-info-alumno.component.html',
  styleUrls: ['./card-info-alumno.component.css']
})
export class CardInfoAlumnoComponent {
  selectedAlumno: any | null = null; // Almacena el alumno seleccionado
  alumnos: any[] = []; // Arreglo para almacenar la lista de alumnos

  constructor(private apisService: ApisService) { }

  ngOnInit() {
    this.loadAlumnos(); // Cargar la lista de alumnos al inicializar el componente
  }

  loadAlumnos() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}'); // Recupera la información del usuario

    if (usuario && usuario.responsable && usuario.responsable.alumnoResponsables) {
      this.alumnos = usuario.responsable.alumnoResponsables; // Obtiene los alumnos del responsable
      if (this.alumnos.length > 0) {
        this.selectedAlumno = this.alumnos[0]; // Selecciona el primer alumno por defecto
      }
    }

    console.log(this.selectedAlumno.alumno.id, 'hOLA'); // Opcional: para verificar los datos
  }

  onSelectAlumno(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Cast de EventTarget a HTMLSelectElement
    const alumnoId = selectElement.value; // Obtiene el ID del alumno seleccionado

    // Inicializa selectedAlumno como null
    this.selectedAlumno = null;

    // Itera sobre los alumnos para encontrar el que coincida con el ID seleccionado
    this.alumnos.forEach(alumno => {
      if (alumno.alumno.id.toString() === alumnoId) { // Compara como cadena
        this.selectedAlumno = alumno; // Asigna el alumno encontrado a selectedAlumno
      }
    });
  }



}
