import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { ApisService } from '../../services/apis.service';
import { onTimeService } from '../../services/actulizarInfor.service';

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

  constructor(private onTimeService: onTimeService, private fb: FormBuilder, private apiService: ApisService) { }

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
    this.alumnos = grupoSeleccionado.alumnos || []; // Asignar los alumnos del grupo seleccionado
    console.log('Alumnos del grupo seleccionado:', this.alumnos);
  }
}