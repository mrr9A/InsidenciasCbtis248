import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-reporte.component.html',
  styleUrl: './add-reporte.component.css'
})
export class AddReporteComponent {

  incidenciaForm: FormGroup;
  alumnos: any[] = []; // Lista de alumnos obtenidos
  grupos: any[] = [];  // Lista de grupos obtenidos
  tiposIncidencia: any[] = [];  // Lista de tipos de incidencia obtenidos

  constructor(private fb: FormBuilder, private apiService: ApisService) {
    this.incidenciaForm = this.fb.group({
      tipo_incidencia_id: [, Validators.required],
      descripcion: ['', Validators.required],
      alumno_id: [, Validators.required],
      grupo_id: [, Validators.required],
      fecha: ['']  // Campo opcional
    });
  }

  ngOnInit(): void {
    this.cargarAlumnos();
    this.cargarGrupos();
    this.cargarTiposIncidencia();
  }

  cargarAlumnos(): void {
    this.apiService.getAlumnos().subscribe({
      next: (data: any) => {
        this.alumnos = data;
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
      }
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

  onSubmit(): void {
    if (this.incidenciaForm.valid) {
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
