import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'cbtis248',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), canActivate: [authGuard]
      },
      {
        path: 'historialIncidencias',
        loadComponent: () => import('./pages/historial/historial.component').then(m => m.HistorialComponent), canActivate: [authGuard]
      },
      {
        path: 'avisos',
        loadComponent: () => import('./pages/avisos/avisos.component').then(m => m.AvisosComponent), canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent), canActivate: [authGuard]
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login/login.component').then(m => m.LoginComponent), canActivate: [authGuard]
      },
      {
        path: 'homeAdmin',
        loadComponent: () => import('./admin/home/home.component').then(m => m.HomeComponent), canActivate: [authGuard]
      },
      {
        path: 'addReporte',
        loadComponent: () => import('./admin/add-reporte/add-reporte.component').then(m => m.AddReporteComponent), canActivate: [authGuard]
      },
      {
        path: 'addAdministrativo',
        loadComponent: () => import('./admin/add-administrativo/add-administrativo.component').then(m => m.AddAdministrativoComponent), canActivate: [authGuard]
      },
      {
        path: 'addResponsable',
        loadComponent: () => import('./admin/add-responsable/add-responsable.component').then(m => m.AddResponsableComponent), canActivate: [authGuard]
      },
      {
        path: 'addAviso',
        loadComponent: () => import('./admin/add-aviso/add-aviso.component').then(m => m.AddAvisoComponent), canActivate: [authGuard]
      },
      {
        path: 'cargaArchiv',
        loadComponent: () => import('./carga-masiva/carga-masiva.component').then(m => m.CargaMasivaComponent)/* , canActivate: [authGuard] */
      },
      {
        path: 'cardsAdd',
        loadComponent: () => import('./admin/component/cards-add/cards-add.component').then(m => m.CardsAddComponent)/* , canActivate: [authGuard] */
      },
      {
        path: 'perfilAdmin',
        loadComponent: () => import('./admin/component/card-admin-perfil/card-admin-perfil.component').then(m => m.CardAdminPerfilComponent)/* , canActivate: [authGuard] */
      },
      {
        path: 'listResponsable',
        loadComponent: () => import('./admin/list-responsables/list-responsables.component').then(m => m.ListResponsablesComponent), canActivate: [authGuard]
      },
      {
        path: 'listAdministrativos',
        loadComponent: () => import('./admin/list-administrativos/list-administrativos.component').then(m => m.ListAdministrativosComponent), canActivate: [authGuard]
      },
      {
        path: 'addAlumno',
        loadComponent: () => import('./admin/add-alumno/add-alumno.component').then(m => m.AddAlumnoComponent), canActivate: [authGuard]
      },
      {
        path: 'listAlumnos',
        loadComponent: () => import('./admin/list-alumno/list-alumno.component').then(m => m.ListAlumnoComponent), canActivate: [authGuard]
      },
      {
        path: 'listAvisos',
        loadComponent: () => import('./admin/component/list-avisos/list-avisos.component').then(m => m.ListAvisosComponent), canActivate: [authGuard]
      },
      {
        path: 'listIncidencias',
        loadComponent: () => import('./admin/component/list-incidencias/list-incidencias.component').then(m => m.ListIncidenciasComponent), canActivate: [authGuard]
      },
      {
        path: 'detalleResponsable/:id',
        loadComponent: () => import('./admin/component/info-responsable/info-responsable.component').then(m => m.InfoResponsableComponent), canActivate: [authGuard]
      },
      {
        path: 'detalleAlumno/:id',
        loadComponent: () => import('./admin/component/info-alumno/info-alumno.component').then(m => m.InfoAlumnoComponent), canActivate: [authGuard]
      },
      {
        path: 'detalleAdministrativo/:id',
        loadComponent: () => import('./admin/component/info-administrativo/info-administrativo.component').then(m => m.InfoAdministrativoComponent), canActivate: [authGuard]
      },
      {
        path: 'detalleAvis/:id',
        loadComponent: () => import('./components/modal-anuncio/modal-anuncio.component').then(m => m.ModalAnuncioComponent), canActivate: [authGuard]
      },
      {
        path: 'detalleIns/:id',
        loadComponent: () => import('./components/modal-historial/modal-historial.component').then(m => m.ModalHistorialComponent), canActivate: [authGuard]
      },
      {
        path: 'editar-alumno/:id',
        loadComponent: () => import('./admin/component/edit/edit-alumno/edit-alumno.component').then(m => m.EditAlumnoComponent), canActivate: [authGuard]
      },
      {
        path: 'editar-padreFamilia/:id',
        loadComponent: () => import('./admin/component/edit/edit-padres/edit-padres.component').then(m => m.EditPadresComponent), canActivate: [authGuard]
      },
      {
        path: 'editar-administrador/:id',
        loadComponent: () => import('./admin/component/edit/edit-administrativos/edit-administrativos.component').then(m => m.EditAdministrativosComponent), canActivate: [authGuard]
      },
      {
        path: 'editar-aviso/:id',
        loadComponent: () => import('./admin/component/edit/edit-aviso/edit-aviso.component').then(m => m.EditAvisoComponent), canActivate: [authGuard]
      },
      {
        path: 'editar-incidencia/:id',
        loadComponent: () => import('./admin/component/edit/edit-incidencia/edit-incidencia.component').then(m => m.EditIncidenciaComponent), canActivate: [authGuard]
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
