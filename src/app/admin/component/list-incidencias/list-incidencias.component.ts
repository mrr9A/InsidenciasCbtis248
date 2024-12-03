import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { onTimeService } from '../../../services/actulizarInfor.service';
import { ApisService } from '../../../services/apis.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../RECURSOS/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

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
  cargando: boolean = false; // Para el spinner

  constructor(private onTimeService: onTimeService, private apiService: ApisService,private router: Router,private snackBar: MatSnackBar, private dialog: MatDialog) {}

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

  actualizarVista(): void {
    if (this.mostrarTodas) {
      this.incidenciasFiltradas = this.incidencias;
    } else if (this.grupoSeleccionado) {
      this.incidenciasFiltradas = this.incidencias.filter(
        (incidencia) => incidencia.grupo.id === this.grupoSeleccionado.id
      );
    } else {
      this.incidenciasFiltradas = [];
    }
  }

  eliminarIncidencia(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Abrir diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        mensaje: '¿Estás seguro de que deseas eliminar esta incidencia?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.cargando = true; // Mostrar spinner
        this.apiService.deleteIncidencia(id).subscribe({
          next: () => {
            this.cargando = false; // Ocultar spinner
            // Actualizar lista de incidencias después de eliminar
            this.incidencias = this.incidencias.filter((incidencia) => incidencia.id !== id);
            this.actualizarVista();
            this.snackBar.open('La incidencia ha sido eliminada con éxito.', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            this.cargando = false; // Ocultar spinner
            console.error('Error al eliminar la incidencia:', error);
            this.snackBar.open(`Ocurrió un error al intentar eliminar la incidencia: ${error.message}`, 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }


  editarAlumno(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    //console.log('Editar aviso con ID:', id);
    // Lógica para editar al alumno
    this.router.navigate(['/cbtis248/editar-incidencia', id]);
  }
}
