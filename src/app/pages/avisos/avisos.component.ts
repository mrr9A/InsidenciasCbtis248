import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAnuncioComponent } from '../../components/modal-anuncio/modal-anuncio.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { ApisService } from '../../services/apis.service';
import { FormsModule } from '@angular/forms';
import { onTimeService } from '../../services/actulizarInfor.service';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, MatSelectModule],
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css']
})
export class AvisosComponent {
  alumnos: any[] = []; // Array para almacenar los alumnos
  avisos: any[] = [];  // Array para almacenar todos los avisos de los alumnos
  fechasDisponibles: string[] = []; // Fechas únicas de los avisos disponibles para el filtro
  anunciosFiltrados: any[] = []; // Avisos filtrados según la fecha seleccionada
  selectedFecha: string = ''; // Fecha seleccionada por el usuario para filtrar
  isModalOpen = false;

  constructor(public dialog: MatDialog, private apiService: ApisService, private onTimeService: onTimeService, private router: Router) { }
  ngOnInit() {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
    this.loadAvisos(); // Cargar avisos al iniciar el componente
  }

  loadAvisos() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (usuario?.responsable?.alumnoResponsables) {
      this.alumnos = usuario.responsable.alumnoResponsables;

      // Itera sobre cada alumno y agrega los avisos de su grupo
      const allAvisos = this.alumnos
        .map(alumno => alumno.alumno.grupo.avisos)
        .flat(); // Aplana el arreglo si hay múltiples avisos

      // Elimina avisos duplicados por ID
      this.avisos = allAvisos.filter((aviso, index, self) =>
        index === self.findIndex(a => a.id === aviso.id)
      );

      // Extrae las fechas únicas de los avisos para el filtro
      this.fechasDisponibles = [...new Set(this.avisos.map(aviso => aviso.fecha))];

      // Inicializar los anuncios filtrados con todos los avisos al inicio
      this.anunciosFiltrados = this.avisos;
    }
  }

  // Filtra los avisos según la fecha seleccionada
  filterAnuncios() {
    this.anunciosFiltrados = this.selectedFecha
      ? this.avisos.filter(aviso => aviso.fecha === this.selectedFecha)
      : this.avisos; // Muestra todos los avisos si no hay fecha seleccionada
  }


  openModal(anuncioId: string): void {
    // Navega al componente de detalle enviando el ID del responsable
    this.router.navigate(['/cbtis248/detalleAvis', anuncioId]); // Cambia '/ruta/lista-responsables' por tu ruta real

  }
}

