import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Obtener el usuario del localStorage
  const usuarioData = localStorage.getItem('usuario');
  const usuario = usuarioData ? JSON.parse(usuarioData) : null;

  // Si el usuario no está autenticado
  if (!usuario) {
    if (!state.url.includes('login')) {
      router.navigate(['/cbtis248/login']); // Redirigir al login si intenta acceder a rutas protegidas
      return false; // No permitir acceso
    }
    return true; // Permitir acceso a la ruta de login
  }

  // Si el usuario está autenticado
  if (usuario) {
    // Si intenta acceder a la ruta de login
    if (state.url.includes('login')) {
      const rol = usuario.responsable?.rol.nombre || usuario.administrativo?.rol.nombre;

      // Redirigir a la ruta correspondiente según el rol
      if (rol === 'Tutor') {
        router.navigate(['/cbtis248/home']);
      } else if (rol === 'Admin' || 'Maestro' || 'Prefecto') {
        router.navigate(['/cbtis248/homeAdmin']);
      }
      return false; // No permitir acceso al login
    }

    // Verificación de rutas permitidas para los usuarios autenticados
    const rutasPermitidas = {
      Tutor: ['historialIncidencias', 'avisos', 'profile','home','detalleAvis/:id','detalleIns/:id'],
      Admin: [
        'homeAdmin', 'addReporte', 'addAdministrativo', 'addResponsable',
        'addAviso', 'listResponsable', 'listAdministrativos', 'addAlumno','listAlumnos','detalleResponsable/:id',
        'detalleAlumno/:id','detalleAdministrativo/:id','listAvisos','listIncidencias'
      ],
      Maestro: [
        'homeAdmin', 'addReporte',
        'addAviso', 'listResponsable', 'listAdministrativos','listAlumnos','detalleResponsable/:id',
        'detalleAlumno/:id','detalleAdministrativo/:id','listAvisos','listIncidencias'
      ],
      Prefecto: [
        'homeAdmin', 'addReporte',
        'addAviso', 'listResponsable', 'listAdministrativos','listAlumnos','detalleResponsable/:id',
        'detalleAlumno/:id','detalleAdministrativo/:id','listAvisos','listIncidencias'
      ],
    };

    const rutaActual = route.routeConfig?.path;
    const rol = usuario.responsable?.rol.nombre || usuario.administrativo?.rol.nombre;

    // Verificar si la ruta actual está permitida para el rol
    if (rol && rutasPermitidas[rol as keyof typeof rutasPermitidas]?.includes(rutaActual || '')) {
      return true; // Permitir el acceso a la ruta
    }

    // Si el usuario no tiene acceso a la ruta, redirigir a la ruta correspondiente
    if (rol === 'Tutor') {
      router.navigate(['/cbtis248/historialIncidencias']); // Redirigir a una ruta permitida para Tutor
    } else if (rol === 'Admin' || 'Maestro' || 'Prefecto') {
      router.navigate(['/cbtis248/homeAdmin']); // Redirigir a una ruta permitida para Admin
    } else {
      router.navigate(['/cbtis248/login']); // En caso de que el rol no sea válido, redirigir al login
    }

    return false; // No permitir el acceso a la ruta no permitida
  }

  return true; // Permitir el acceso a la ruta si no hay redirecciones
};
