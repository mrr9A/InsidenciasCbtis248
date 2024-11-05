import { Component, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { onTimeService } from '../../services/actulizarInfor.service';

@Component({
  selector: 'app-modal-historial',
  standalone: true,
  imports: [],
  templateUrl: './modal-historial.component.html',
  styleUrl: './modal-historial.component.css'
})
export class ModalHistorialComponent {

  constructor(private onTimeService : onTimeService,public dialogRef: MatDialogRef<ModalHistorialComponent>, private elementRef: ElementRef) {
    // Muestra el modal al abrirlo
    setTimeout(() => {
      const content = this.elementRef.nativeElement.querySelector('.content');
      content.classList.add('show');
    }, 0);
  }

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
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
