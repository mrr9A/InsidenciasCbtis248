import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAnuncioComponent } from '../../components/modal-anuncio/modal-anuncio.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule,MenuComponent],
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css']
})
export class AvisosComponent {
  private dialogRef: any; // Para almacenar la referencia del dialogo
  isModalOpen = false;
  constructor(public dialog: MatDialog) {}

  openModal(): void {
    this.isModalOpen = true; // Abre el modal
    const dialogRef = this.dialog.open(ModalAnuncioComponent, {
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
