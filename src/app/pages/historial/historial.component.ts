import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ModalHistorialComponent } from '../../components/modal-historial/modal-historial.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [MenuComponent,CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {

  private dialogRef: any; // Para almacenar la referencia del dialogo
  isModalOpen = false;
  constructor(public dialog: MatDialog) {}

  openModal(): void {
    this.isModalOpen = true; // Abre el modal
    const dialogRef = this.dialog.open(ModalHistorialComponent, {
      width: '100%', // Ancho completo para el modal
      height: '100%', // Alto completo para el modal
      panelClass: 'full-screen-modal' // Clase personalizada para el modal
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isModalOpen = false; // Cierra el modal
      console.log('El modal fue cerrado');
    });
  }

}
