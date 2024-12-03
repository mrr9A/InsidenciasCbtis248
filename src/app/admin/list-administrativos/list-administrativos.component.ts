import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApisService } from '../../services/apis.service';
import { MatSelectChange } from '@angular/material/select';
import { onTimeService } from '../../services/actulizarInfor.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-administrativos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuAdminComponent, MatSelectModule],
  templateUrl: './list-administrativos.component.html',
  styleUrl: './list-administrativos.component.css'
})
export class ListAdministrativosComponent {

  roles: any[] = [];
  administrativos: any[] = [];
  allAdministrativos: any[] = [];

  constructor(private onTimeService: onTimeService, private apiService: ApisService, private router: Router) { }

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
    this.getRoles();
  }

  getRoles(): void {
    this.apiService.getRoles().subscribe((data: any[]) => {
      // Filtrar roles para omitir el rol de "tutor"
      this.roles = data.filter(role => role.nombre !== 'Tutor'); // Cambia 'Tutor' si el nombre es diferente
      this.loadAllAdministrativos();
    });
  }


  loadAllAdministrativos(): void {
    this.allAdministrativos = this.roles.flatMap(role => role.administrativos);
    this.administrativos = [...this.allAdministrativos]; // Mostrar todos por defecto
  }

  onRoleChange(event: MatSelectChange): void {
    const roleId = event.value;

    if (roleId === 'all') {
      this.administrativos = [...this.allAdministrativos];
    } else {
      const selectedRole = this.roles.find(role => role.id === +roleId);
      this.administrativos = selectedRole ? selectedRole.administrativos : [];
    }
  }

  // Navega al componente de detalle enviando el ID del responsable
  verDetalleAdministrativo(id: string): void {
    this.router.navigate(['/cbtis248/detalleAdministrativo', id]); // Cambia '/ruta/lista-responsables' por tu ruta real
  }


  editarAdministrativo(id: number, event: Event): void {
    event.stopPropagation(); // Evita cerrar el dropdown al hacer clic
    console.log('Editar administrativo con ID:', id);
    // Implementa la lógica para redirigir o abrir un modal de edición
    this.router.navigate(['/cbtis248/editar-administrador', id]);
  }

  eliminarAdministrativo(id: number, event: Event): void {
    event.stopPropagation(); // Evita cerrar el dropdown al hacer clic
    console.log('Eliminar administrativo con ID:', id);
    // Implementa la lógica para eliminar al administrativo
  }
}
