import { Component } from '@angular/core';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { onTimeService } from '../../../services/actulizarInfor.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApisService } from '../../../services/apis.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-cards-add',
  standalone: true,
  imports: [MenuAdminComponent,CommonModule,RouterModule,NgxChartsModule],
  templateUrl: './cards-add.component.html',
  styleUrl: './cards-add.component.css'
})
export class CardsAddComponent {

  usuario: any;
  correo: string = '';
  password: string = '';
  telefono: string = '';
  tipoPerfil: string = '';

  incidenciasData: any[] = [];
  chartData: any[] = [];
  avisosData: any[] = [];  // Para almacenar los avisos
  chartAvisosData: any[] = [];  // Para almacenar los datos de la gráfica de avisos


  constructor(private onTimeService: onTimeService,private apiService: ApisService) { }

  ngOnInit(): void {
    setInterval(() => {
    this.onTimeService.getActualUser();
  }, 180000);
  this.loadUsuario();
  this.loadIncidencias(); // Cargar las incidencias al inicio
  this.loadAvisos(); // Cargar los avisos al inicio
  }

  loadUsuario() {
    // Recupera el usuario desde localStorage
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
      //console.log(this.usuario);

      // Asigna los datos a las variables para mostrarlos en el HTML
      this.correo = this.usuario.administrativo?.correo_electronico || '';
      this.password = this.usuario.password || '';
      this.telefono = this.usuario.administrativo?.num_telefono || '';
      this.tipoPerfil = this.usuario.administrativo?.rol?.nombre || 'Responsable';
    }
  }

  loadIncidencias() {
    // Llamada a la API para obtener incidencias
    this.apiService.getincidencia().subscribe((data: any) => {
      this.incidenciasData = data;
      this.processChartData();
    });
  }

  processChartData() {
    // Procesamos los datos de incidencias para obtener los tipos y sus cantidades
    const incidenceCount = this.incidenciasData.reduce((acc: any, incidencia: any) => {
      const tipo = incidencia.tipo_incidencia.nombre;
      if (acc[tipo]) {
        acc[tipo]++;
      } else {
        acc[tipo] = 1;
      }
      return acc;
    }, {});

    // Convertimos los datos a un formato compatible con ngx-charts
    this.chartData = Object.keys(incidenceCount).map(tipo => ({
      name: tipo,
      value: incidenceCount[tipo]
    }));
  }

  loadAvisos() {
    this.apiService.getAvisos().subscribe((data: any) => {
      this.avisosData = data;
      this.processAvisosChartData();
    });
  }

 processAvisosChartData() {
    // Agrupar avisos por fecha
    const avisosCount = this.avisosData.reduce((acc: any, aviso: any) => {
      const fecha = new Date(aviso.fecha).toLocaleDateString(); // Agrupar por fecha
      if (acc[fecha]) {
        acc[fecha]++;
      } else {
        acc[fecha] = 1;
      }
      return acc;
    }, {});

    // Convertir los datos a un formato compatible con ngx-charts
    this.chartAvisosData = Object.keys(avisosCount).map(fecha => ({
      name: fecha,
      value: avisosCount[fecha]
    }));
  }
}
