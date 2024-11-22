import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { onTimeService } from '../../../services/actulizarInfor.service';
import { ApisService } from '../../../services/apis.service';

@Component({
  selector: 'app-list-avisos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule, MatListModule],
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

  constructor(private onTimeService: onTimeService, private apiServices: ApisService) { }

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
}
