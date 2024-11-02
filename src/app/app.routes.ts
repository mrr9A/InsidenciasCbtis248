import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cbtis248',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'historialIncidencias',
        loadComponent: () => import('./pages/historial/historial.component').then(m => m.HistorialComponent)
      },
      {
        path: 'avisos',
        loadComponent: () => import('./pages/avisos/avisos.component').then(m => m.AvisosComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'homeAdmin',
        loadComponent: () => import('./admin/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'addReporte',
        loadComponent: () => import('./admin/add-reporte/add-reporte.component').then(m => m.AddReporteComponent)
      },
      {
        path: 'addAdministrativo',
        loadComponent: () => import('./admin/add-administrativo/add-administrativo.component').then(m => m.AddAdministrativoComponent)
      },
      {
        path: 'addResponsable',
        loadComponent: () => import('./admin/add-responsable/add-responsable.component').then(m => m.AddResponsableComponent)
      },
      {
        path: 'addAviso',
        loadComponent: () => import('./admin/add-aviso/add-aviso.component').then(m => m.AddAvisoComponent)
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'cbtis248'
  }
];
