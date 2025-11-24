import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confimation-dialog',
    templateUrl: './confimation-dialog.component.html',
    styleUrl: './confimation-dialog.component.scss',
    standalone: true,
    imports: [MatDialogContent, MatDialogActions, MatButton]
})
//Original v2
export class ConfimationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfimationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ){ }

  onConfirm(result: boolean): void {
    // CORREÇÃO: Envolvemos o close em um setTimeout
    // Isso força a execução a esperar o ciclo atual do Angular terminar
    setTimeout(() => {
      this.dialogRef.close(result);
    }, 0);
  }

}