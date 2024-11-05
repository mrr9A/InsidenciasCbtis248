import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { onTimeService } from '../../services/actulizarInfor.service';

@Component({
  selector: 'app-add-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule],
  templateUrl: './add-reporte.component.html',
  styleUrl: './add-reporte.component.css'
})
export class AddReporteComponent {

  incidenciaForm: FormGroup;
  alumnos: any[] = []; // Lista de alumnos a mostrar
  grupos: any[] = [];  // Lista de grupos obtenidos
  tiposIncidencia: any[] = [];  // Lista de tipos de incidencia obtenidos

  constructor(private onTimeService : onTimeService,private fb: FormBuilder, private apiService: ApisService) {
    this.incidenciaForm = this.fb.group({
      tipo_incidencia_id: [, Validators.required],
      descripcion: ['', Validators.required],
      alumno_id: [, Validators.required],
      grupo_id: [, Validators.required],
      fecha: ['']  // Campo opcional
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
    this.cargarGrupos();
    this.cargarTiposIncidencia();

    // Escucha los cambios en el campo grupo_id
    this.incidenciaForm.get('grupo_id')?.valueChanges.subscribe((grupoId) => {
      this.cargarAlumnosPorGrupo(grupoId);
    });
  }

  cargarGrupos(): void {
    this.apiService.getGrupos().subscribe({
      next: (data: any) => {
        this.grupos = data;
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
      }
    });
  }

  cargarTiposIncidencia(): void {
    this.apiService.getIncidencia().subscribe({
      next: (data: any) => {
        this.tiposIncidencia = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de incidencia:', error);
      }
    });
  }

  cargarAlumnosPorGrupo(grupoId: number): void {
    const grupoSeleccionado = this.grupos.find(grupo => grupo.id === grupoId);
    if (grupoSeleccionado && grupoSeleccionado.alumnos.length > 0) {
      this.alumnos = grupoSeleccionado.alumnos;
    } else {
      this.alumnos = []; // Limpia la lista si no hay alumnos
      this.incidenciaForm.get('alumno_id')?.reset(); // Resetea el valor del select de alumnos
    }
  }

    onSubmit(): void {
      if (this.incidenciaForm.valid) {
        // Agregar la fecha actual si no se ha proporcionado una
        const fechaActual = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
        this.incidenciaForm.get('fecha')?.setValue(fechaActual);

        const formData = this.incidenciaForm.value;
        console.log('Datos enviados:', formData);

        // Llamada a la API para guardar los datos
        this.apiService.postIncidencia(formData).subscribe({
          next: () => console.log('Incidencia guardada con éxito'),
          error: (error) => console.error('Error al guardar incidencia:', error)
        });
      }
    }


}
