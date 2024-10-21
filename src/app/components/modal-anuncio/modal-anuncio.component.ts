import { Component, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-anuncio',
  standalone: true,
  imports: [],
  templateUrl: './modal-anuncio.component.html',
  styleUrls: ['./modal-anuncio.component.css']
})
export class ModalAnuncioComponent {

  constructor(public dialogRef: MatDialogRef<ModalAnuncioComponent>, private elementRef: ElementRef) {
    // Muestra el modal al abrirlo
    setTimeout(() => {
      const content = this.elementRef.nativeElement.querySelector('.content');
      content.classList.add('show');
    }, 0);
  }

  onClose(): void {
    const content = this.elementRef.nativeElement.querySelector('.content');
    if (content) {
      content.classList.remove('show');
      setTimeout(() => {
        this.dialogRef.close();
      }, 300); // Tiempo debe coincidir con la duración de la transición
    }
  }
}
