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
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
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
