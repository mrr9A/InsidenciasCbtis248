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
        path: '**',
        redirectTo: 'home'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'cbtis248'
  }
];
