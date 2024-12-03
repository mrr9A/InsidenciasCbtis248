import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmar acción</h2>
    <mat-dialog-content>
      <p>{{ data.mensaje }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancelar()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirmar()">Eliminar</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelar(): void {
    this.dialogRef.close(false);
  }

  onConfirmar(): void {
    this.dialogRef.close(true);
  }
}
