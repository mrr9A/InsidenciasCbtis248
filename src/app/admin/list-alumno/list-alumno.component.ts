import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { ApisService } from '../../services/apis.service';
import { onTimeService } from '../../services/actulizarInfor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-alumno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule],
  templateUrl: './list-alumno.component.html',
  styleUrl: './list-alumno.component.css'
})
export class ListAlumnoComponent {

  grupos: any[] = [];  // Lista de grupos obtenidos
  alumnos: any[] = []; // Lista de alumnos del grupo seleccionado

  constructor(private onTimeService: onTimeService, private fb: FormBuilder, private apiService: ApisService, private router: Router) { }

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

  editarAlumno(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Editar alumno con ID:', id);
    // Lógica para editar al alumno
    this.router.navigate(['/cbtis248/editar-alumno', id]);
  }

  eliminarAlumno(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Eliminar alumno con ID:', id);
    // Lógica para eliminar al alumno
  }

  onGrupoSeleccionado(grupoSeleccionado: any): void {
    this.alumnos = grupoSeleccionado.alumnos || []; // Asignar los alumnos del grupo seleccionado
    console.log('Alumnos del grupo seleccionado:', this.alumnos);
  }

  // Navega al componente de detalle enviando el ID del responsable
  verDetalleAlumno(id: string): void {
    this.router.navigate(['/cbtis248/detalleAlumno', id]); // Cambia '/ruta/lista-responsables' por tu ruta real
  }
}
