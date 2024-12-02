import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { ApisService } from '../../services/apis.service';
import { onTimeService } from '../../services/actulizarInfor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-responsables',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule],
  templateUrl: './list-responsables.component.html',
  styleUrls: ['./list-responsables.component.css']
})
export class ListResponsablesComponent {
  grupos: any[] = [];  // Lista de grupos obtenidos
  responsables: any[] = []; // Lista de responsables del grupo seleccionado

  constructor(private router: Router, private onTimeService: onTimeService, private fb: FormBuilder, private apiService: ApisService) { }

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.apiService.getGrupos().subscribe({
      next: (data: any) => {
        this.grupos = data;
        //console.log(this.grupos);
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
      }
    });
  }

  onGrupoSeleccionado(grupoSeleccionado: any): void {
    this.responsables = this.extraerResponsables(grupoSeleccionado.alumnos); // Extraer los responsables
    //console.log('Responsables del grupo seleccionado:', this.responsables);
  }

  extraerResponsables(alumnos: any[]): any[] {
    let responsables: any[] = [];
    alumnos.forEach(alumno => {
      if (alumno.alumnoResponsables && alumno.alumnoResponsables.length > 0) {
        // Suponemos que solo tomamos el primer responsable en caso de que haya más de uno
        responsables.push(alumno.alumnoResponsables[0]);
      }
    });
    return responsables; // Retornar la lista de responsables
  }

  // Navega al componente de detalle enviando el ID del responsable
  verDetalleResponsable(id: string): void {
    this.router.navigate(['/cbtis248/detalleResponsable',id]); // Cambia '/ruta/lista-responsables' por tu ruta real
  }

  editarResponsable(id: number, event: Event): void {
    event.stopPropagation(); // Evita cerrar el dropdown al hacer clic
    console.log('Editar responsable con ID:', id);
    // Implementa la lógica para redirigir o abrir un modal de edición
    this.router.navigate(['/cbtis248/editar-padreFamilia', id]);
  }

  eliminarResponsable(id: number, event: Event): void {
    event.stopPropagation(); // Evita cerrar el dropdown al hacer clic
    console.log('Eliminar responsable con ID:', id);
    // Implementa la lógica para eliminar al responsable
  }
}
