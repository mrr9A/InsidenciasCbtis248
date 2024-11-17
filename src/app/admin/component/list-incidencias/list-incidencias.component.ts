import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { onTimeService } from '../../../services/actulizarInfor.service';

@Component({
  selector: 'app-list-incidencias',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule, FormsModule],

  templateUrl: './list-incidencias.component.html',
  styleUrl: './list-incidencias.component.css'
})
export class ListIncidenciasComponent {

  incidencias: any[] = [];                // Array para almacenar todas las incidencias
  grupos: any[] = [];                     // Array para almacenar los grupos únicos
  incidenciasFiltradas: any[] = [];       // Array para almacenar las incidencias filtradas por grupo
  grupoSeleccionado: any = null;          // Grupo actualmente seleccionado
  incidenciaSeleccionada: any = null;     // Incidencia actualmente seleccionada para mostrar detalles
  mostrarIncidencias: boolean = false;    // Control de visualización de la lista de incidencias
constructor(private onTimeService: onTimeService){}
  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 1800);
    // Obtener los datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.incidencias = usuario.administrativo?.incidencias || [];

    // Crear una lista única de grupos usando Set para evitar duplicados
    this.grupos = Array.from(
      new Set(this.incidencias.map(incidencia => JSON.stringify(incidencia.grupo)))
    ).map(grupo => JSON.parse(grupo));
  }

  // Método para filtrar las incidencias según el grupo seleccionado
  onGrupoSeleccionado(grupoSeleccionado: any): void {
    if (grupoSeleccionado) {
      this.grupoSeleccionado = grupoSeleccionado;
      this.incidenciasFiltradas = this.incidencias.filter(
        incidencia => incidencia.grupo.id === grupoSeleccionado.id
      );
      this.mostrarIncidencias = this.incidenciasFiltradas.length > 0;
    } else {
      this.incidenciasFiltradas = [];
      this.mostrarIncidencias = false;
    }
  }

  // Método para alternar la visualización de los detalles de una incidencia específica
  toggleDetalleIncidencia(incidencia: any): void {
    this.incidenciaSeleccionada = this.incidenciaSeleccionada === incidencia ? null : incidencia;
  }
}
