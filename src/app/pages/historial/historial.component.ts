import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { onTimeService } from '../../services/actulizarInfor.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalHistorialComponent } from '../../components/modal-historial/modal-historial.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [MenuComponent, CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  alumnos: any[] = []; // Array para almacenar los alumnos
  incidenciasFiltradas: any[] = []; // Incidencias filtradas según el tipo seleccionado
  fechasDisponibles: string[] = []; // Fechas únicas de las incidencias
  selectedFecha: string = ''; // Fecha seleccionada
  selectedAlumnoId: number | null = null; // ID del alumno seleccionado
  chooseDate: string = '';
  isModalOpen = false;
constructor(private onTimeService : onTimeService,public dialog: MatDialog){}
  ngOnInit() {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
    this.loadAlumnos(); // Cargar incidencias al iniciar el componente
  }
  loadAlumnos() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    console.log('Usuario cargado:', usuario); // Verifica el usuario cargado

    if (usuario?.responsable?.alumnoResponsables) {
      this.alumnos = usuario.responsable.alumnoResponsables.map((ar: any) => ar.alumno);
      console.log('Alumnos cargados:', this.alumnos); // Verifica los alumnos obtenidos
    }
  }
  onAlumnoSeleccionado(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedAlumnoId = Number(selectElement.value);

    console.log('Alumno ID seleccionado:', this.selectedAlumnoId);

    // Busca las incidencias del alumno seleccionado
    const alumno = this.alumnos.find(alumno => alumno.id === this.selectedAlumnoId);
    console.log('Alumno encontrado:', alumno);

    if (alumno) {
      this.chooseDate = ''
      // Extrae fechas únicas de las incidencias del alumno, asegurando que sean de tipo string
      this.fechasDisponibles = Array.from(
        new Set(alumno.incidencias.map((incidencia: any) => incidencia.fecha))
      ) as string[];

      console.log('Fechas disponibles:', this.fechasDisponibles);

      this.selectedFecha = ''; // Reinicia la fecha seleccionada
      this.incidenciasFiltradas = []; // Limpia las incidencias filtradas
    }
  }

  onFechaSeleccionada(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedFecha = selectElement.value;

    console.log('Fecha seleccionada para filtrar:', this.selectedFecha); // Verifica la fecha seleccionada
    this.filterIncidencias(); // Llama al filtro al seleccionar la fecha
  }

  filterIncidencias() {
    console.log('Alumno ID seleccionado para filtrar:', this.selectedAlumnoId);
    console.log('Fecha seleccionada para filtrar:', this.selectedFecha);

    // Asegúrate de que haya un alumno y una fecha seleccionada
    if (this.selectedAlumnoId && this.selectedFecha) {
      const alumno = this.alumnos.find(alumno => alumno.id === this.selectedAlumnoId);

      if (alumno) {
        // Filtra las incidencias del alumno que coincidan con la fecha seleccionada
        this.incidenciasFiltradas = alumno.incidencias.filter((incidencia: any) => {
          return incidencia.fecha === this.selectedFecha;
        });

        console.log('Incidencias filtradas:', this.incidenciasFiltradas); // Verifica el resultado del filtro
      }
    }
  }

    openModal(anuncioId: number): void {
      this.isModalOpen = true; // Abre el modal
      const dialogRef = this.dialog.open(ModalHistorialComponent, {
        width: '100%', // Ancho completo para el modal
        height: '100%', // Alto completo para el modal
        panelClass: 'full-screen-modal', // Clase personalizada para el modal
        data: { anuncioId }  // Pasa el ID del aviso
      });

      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false; // Cierra el modal
        console.log('El modal fue cerrado');
      });
    }
}
