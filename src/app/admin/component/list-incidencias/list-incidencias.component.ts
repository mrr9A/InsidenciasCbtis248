import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { onTimeService } from '../../../services/actulizarInfor.service';
import { ApisService } from '../../../services/apis.service';

@Component({
  selector: 'app-list-incidencias',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule, FormsModule],
  templateUrl: './list-incidencias.component.html',
  styleUrls: ['./list-incidencias.component.css']
})
export class ListIncidenciasComponent {

  incidencias: any[] = [];                // Array para almacenar todas las incidencias
  incidenciasFiltradas: any[] = [];       // Array para almacenar las incidencias filtradas por grupo
  grupos: any[] = [];                     // Array para almacenar los grupos únicos
  grupoSeleccionado: any = null;          // Grupo actualmente seleccionado
  incidenciaSeleccionada: any = null;     // Incidencia actualmente seleccionada para mostrar detalles
  mostrarIncidencias: boolean = false;    // Control de visualización de la lista de incidencias
  mostrarTodas: boolean = false;          // Flag para controlar si se muestran todas las incidencias

  constructor(private onTimeService: onTimeService, private apiService: ApisService) {}

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 1800);

    // Obtener los datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const adminId = usuario.id;  // ID del administrativo

    // Llamar a la API para obtener todas las incidencias
    this.apiService.getincidencia().subscribe(
      (data: any) => {
        // Filtrar las incidencias por el ID del administrativo si se seleccionan "incidencias del administrativo"
        this.incidencias = data;

        // Crear una lista única de grupos usando Set para evitar duplicados
        this.grupos = Array.from(
          new Set(this.incidencias.map((incidencia: any) => JSON.stringify(incidencia.grupo)))
        ).map(grupo => JSON.parse(grupo));

        // Filtrar las incidencias que el administrativo ha levantado
        this.onGrupoSeleccionado(adminId);
      },
      (error) => {
        console.error('Error al obtener incidencias:', error);
      }
    );
  }

  // Método para filtrar las incidencias según el grupo seleccionado o mostrar todas
  onGrupoSeleccionado(grupoSeleccionado: any): void {
    if (grupoSeleccionado === 'todas') {
      // Mostrar todas las incidencias
      this.incidenciasFiltradas = this.incidencias;
      this.mostrarIncidencias = true;
      this.mostrarTodas = true;
    } else if (grupoSeleccionado) {
      // Filtrar las incidencias según el grupo
      this.grupoSeleccionado = grupoSeleccionado;
      this.incidenciasFiltradas = this.incidencias.filter(
        incidencia => incidencia.grupo.id === grupoSeleccionado.id
      );
      this.mostrarIncidencias = this.incidenciasFiltradas.length > 0;
      this.mostrarTodas = false;
    } else {
      this.incidenciasFiltradas = [];
      this.mostrarIncidencias = false;
      this.mostrarTodas = false;
    }
  }

  // Método para alternar la visualización de los detalles de una incidencia específica
  toggleDetalleIncidencia(incidencia: any): void {
    this.incidenciaSeleccionada = this.incidenciaSeleccionada === incidencia ? null : incidencia;
  }
}
