import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { onTimeService } from '../../services/actulizarInfor.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalHistorialComponent } from '../../components/modal-historial/modal-historial.component';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [MenuComponent, CommonModule, FormsModule, MatSelectModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  alumnos: any[] = []; // Lista de alumnos
  incidenciasFiltradas: any[] = []; // Incidencias filtradas según el alumno y fecha seleccionados
  fechasDisponibles: string[] = []; // Fechas únicas de incidencias del alumno seleccionado
  selectedFecha: string = ''; // Fecha seleccionada
  selectedAlumnoId: number | null = null; // ID del alumno seleccionado
  chooseDate: string = ''; // Fecha seleccionada en el selector
  isModalOpen = false; // Estado del modal

  constructor(private onTimeService: onTimeService,private router: Router) { }

  ngOnInit() {
    // Actualiza la información del usuario cada 3 minutos
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 1800);

    // Carga la lista de alumnos al inicializar el componente
    this.loadAlumnos();
  }

  loadAlumnos() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    //console.log('Usuario cargado:', usuario); // Verifica el usuario cargado

    if (usuario?.responsable?.alumnoResponsables) {
      // Mapea la lista de alumnos responsables
      this.alumnos = usuario.responsable.alumnoResponsables.map((ar: any) => ar.alumno);
      //console.log('Alumnos cargados:', this.alumnos); // Verifica los alumnos obtenidos
    }
  }

  onAlumnoSeleccionado(alumnoId: number) {
    this.selectedAlumnoId = alumnoId; // Establece el alumno seleccionado
    //console.log('Alumno ID seleccionado:', this.selectedAlumnoId);

    // Busca las incidencias del alumno seleccionado
    const alumno = this.alumnos.find(alumno => alumno.id === this.selectedAlumnoId);
    //console.log('Alumno encontrado:', alumno);

    if (alumno) {
      // Extrae fechas únicas de las incidencias del alumno
      this.fechasDisponibles = Array.from(
        new Set(alumno.incidencias.map((incidencia: any) => incidencia.fecha))
      ) as string[];
      //console.log('Fechas disponibles:', this.fechasDisponibles);

      this.chooseDate = ''; // Reinicia la fecha seleccionada
      this.incidenciasFiltradas = []; // Limpia las incidencias filtradas
    }
  }

  onFechaSeleccionada(fecha: string) {
    this.selectedFecha = fecha; // Establece la fecha seleccionada
    //console.log('Fecha seleccionada:', this.selectedFecha);

    this.filterIncidencias(); // Llama al filtro para actualizar las incidencias
  }

  filterIncidencias() {
    //console.log('Filtrando incidencias para el alumno y la fecha seleccionados...');
    //console.log('Alumno ID:', this.selectedAlumnoId);
    //console.log('Fecha:', this.selectedFecha);

    if (this.selectedAlumnoId && this.selectedFecha) {
      const alumno = this.alumnos.find(alumno => alumno.id === this.selectedAlumnoId);

      if (alumno) {
        // Filtra las incidencias del alumno que coincidan con la fecha seleccionada
        this.incidenciasFiltradas = alumno.incidencias.filter((incidencia: any) => {
          return incidencia.fecha === this.selectedFecha;
        });
        //console.log('Incidencias filtradas:', this.incidenciasFiltradas);
      }
    }
  }

  openModal(incidenciaId: string): void {
    // Navega al componente de detalle enviando el ID del responsable
    this.router.navigate(['/cbtis248/detalleIns', incidenciaId]); // Cambia '/ruta/lista-responsables' por tu ruta real
  }
}
