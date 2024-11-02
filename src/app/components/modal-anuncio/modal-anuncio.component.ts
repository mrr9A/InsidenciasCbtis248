import { Component, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-anuncio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-anuncio.component.html',
  styleUrls: ['./modal-anuncio.component.css']
})
export class ModalAnuncioComponent {
  anuncio: any;

  constructor(public dialogRef: MatDialogRef<ModalAnuncioComponent>, private elementRef: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: { anuncioId: number },
    private apisService: ApisService
  ) {
    // Muestra el modal al abrirlo
    setTimeout(() => {
      const content = this.elementRef.nativeElement.querySelector('.content');
      content.classList.add('show');
    }, 0);
  }

  ngOnInit(): void {
    this.apisService.getAvisos().subscribe((data: any[]) => {
      this.anuncio = data.find(anuncio => anuncio.id === this.data.anuncioId);
    });
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
