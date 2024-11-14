import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from '../../../services/apis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-alumno',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-alumno.component.html',
  styleUrl: './info-alumno.component.css'
})
export class InfoAlumnoComponent {
  alumno: any;
  mostrarIncidencias: boolean = false;
  incidencias: any[] = [];
  incidenciaSeleccionada: any = null;

  constructor(private route: ActivatedRoute, private apiService: ApisService, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getAlumnoById(id).subscribe(data => {
        this.alumno = data;
        console.log(this.alumno);

        // Asignamos las incidencias de `this.alumno` a `this.incidencias`
        this.incidencias = this.alumno.incidencias || [];
      });
    }
  }

  toggleIncidencias() {
    this.mostrarIncidencias = !this.mostrarIncidencias;
    this.incidenciaSeleccionada = null;
  }

  toggleDetalleIncidencia(incidencia: any) {
    this.incidenciaSeleccionada = this.incidenciaSeleccionada === incidencia ? null : incidencia;
  }

  onClose() {
    this.router.navigate(['cbtis248/listAlumnos']);
  }
}
