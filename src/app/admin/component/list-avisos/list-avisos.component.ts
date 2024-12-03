import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { onTimeService } from '../../../services/actulizarInfor.service';
import { ApisService } from '../../../services/apis.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../RECURSOS/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-avisos',
  standalone: true,
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, CommonModule, MenuAdminComponent, MatSelectModule, MatListModule],
  templateUrl: './list-avisos.component.html',
  styleUrl: './list-avisos.component.css',
})
export class ListAvisosComponent {
  usuario: any = null;
  avisos: any[] = []; // Avisos del administrativo actual
  todosLosAvisos: any[] = []; // Todos los avisos
  avisosFiltrados: any[] = []; // Avisos según el filtro seleccionado
  avisoSeleccionado: any = null;
  fechasUnicas: string[] = [];
  vistaSeleccionada: string = 'mios'; // Por defecto, "Mis avisos"
  cargando: boolean = false; // Para el spinner

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private onTimeService: onTimeService, private apiServices: ApisService, private router: Router) { }

  ngOnInit() {
    const usuarioData = localStorage.getItem('usuario');
    this.usuario = usuarioData ? JSON.parse(usuarioData) : null;

    // Obtener avisos del usuario actual
    this.avisos = this.usuario?.administrativo?.avisos || [];
    this.avisosFiltrados = this.avisos;

    // Obtener todos los avisos desde el API
    this.obtenerTodosLosAvisos();

    // Extraer fechas únicas
    this.obtenerFechasUnicas();

    // Actualizar información periódicamente
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 1800);
  }

  obtenerTodosLosAvisos() {
    this.apiServices.getAvisos().subscribe(
      (data: any[]) => {
        //console.log('Datos obtenidos de la API:', data); // Asegúrate de que esto muestra datos
        this.todosLosAvisos = data || []; // Verifica la estructura y ajusta si es necesario
        this.actualizarVista(); // Actualiza la vista cuando los datos estén listos
      },
      (error) => {
        console.error('Error al obtener los avisos:', error);
      }
    );
  }

  actualizarVista() {
    if (this.vistaSeleccionada === 'todos') {
      this.avisosFiltrados = this.todosLosAvisos;
    } else {
      this.avisosFiltrados = this.avisos;
    }
    this.obtenerFechasUnicas(); // Actualiza las fechas únicas basadas en la vista actual
  }

  obtenerFechasUnicas() {
    const avisos = this.vistaSeleccionada === 'todos' ? this.todosLosAvisos : this.avisos;
    const fechas = avisos.map((aviso) => aviso.fecha).filter((fecha) => fecha);
    this.fechasUnicas = [...new Set(fechas)];
    //console.log(this.fechasUnicas);

  }

  onVistaSeleccionada(vista: string) {
    this.vistaSeleccionada = vista;

    //console.log('Vista seleccionada:', vista);
    //console.log('Avisos cargados:', this.todosLosAvisos);

    if (vista === 'todos') {
      this.avisosFiltrados = this.todosLosAvisos;
      //console.log('Avisos filtrados (todos):', this.avisosFiltrados);
    } else if (vista === 'mios') {
      this.avisosFiltrados = this.avisos;
      //console.log('Avisos filtrados (míos):', this.avisosFiltrados);
    }

    this.obtenerFechasUnicas(); // Actualizar las fechas únicas según la vista
  }


  onFechaSeleccionada(fecha: string) {
    const avisos = this.vistaSeleccionada === 'todos' ? this.todosLosAvisos : this.avisos;
    this.avisosFiltrados = fecha === 'todos'
      ? avisos
      : avisos.filter((aviso) => aviso.fecha && aviso.fecha.startsWith(fecha));
    //console.log(this.vistaSeleccionada, this.avisosFiltrados);

  }

  toggleDetalleAviso(aviso: any) {
    this.avisoSeleccionado = this.avisoSeleccionado === aviso ? null : aviso;
  }

  editarAlumno(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Editar aviso con ID:', id);
    // Lógica para editar al alumno
    this.router.navigate(['/cbtis248/editar-aviso', id]);
  }

  eliminarAviso(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Abrir diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        mensaje: '¿Estás seguro de que deseas eliminar este aviso?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.cargando = true; // Mostrar spinner
        this.apiServices.deleteAviso(id).subscribe({
          next: () => {
            this.cargando = false; // Ocultar spinner
            this.avisos = this.avisos.filter((aviso) => aviso.id !== id);
            this.todosLosAvisos = this.todosLosAvisos.filter((aviso) => aviso.id !== id);
            this.actualizarVista();
            this.snackBar.open('El aviso ha sido eliminado con éxito.', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            this.cargando = false; // Ocultar spinner
            console.error('Error al eliminar el aviso:', error);
            this.snackBar.open(`Ocurrió un error al intentar eliminar el aviso.: ${error.message}`, 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

}
