import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { onTimeService } from '../../../services/actulizarInfor.service';

@Component({
  selector: 'app-list-avisos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule,MatListModule],
  templateUrl: './list-avisos.component.html',
  styleUrl: './list-avisos.component.css'
})
export class ListAvisosComponent {
  usuario: any = null;
  avisos: any[] = [];
  avisosFiltrados: any[] = [];
  avisoSeleccionado: any = null;
  fechasUnicas: string[] = [];

  constructor(private onTimeService: onTimeService){}

  ngOnInit() {
    const usuarioData = localStorage.getItem('usuario');
    this.usuario = usuarioData ? JSON.parse(usuarioData) : null;

    // Avisos del administrativo
    this.avisos = this.usuario?.administrativo?.avisos || [];
    this.avisosFiltrados = this.avisos;

    // Extraer fechas únicas para el filtro
    this.obtenerFechasUnicas();
    //Cargar y guardar la informacion nueva
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 1800);
  }

  obtenerFechasUnicas() {
    const fechas = this.avisos.map((aviso) => aviso.fecha.split('T')[0]);
    this.fechasUnicas = [...new Set(fechas)];
  }

  onFechaSeleccionada(fecha: string) {
    this.avisosFiltrados = fecha === 'todos'
      ? this.avisos
      : this.avisos.filter((aviso) => aviso.fecha.startsWith(fecha));
  }

  toggleDetalleAviso(aviso: any) {
    this.avisoSeleccionado = this.avisoSeleccionado === aviso ? null : aviso;
  }
}
