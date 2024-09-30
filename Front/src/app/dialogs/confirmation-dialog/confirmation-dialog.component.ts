import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';  // Importar TranslateService
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ 'CONFIRM_DIALOG.TITLE' | translate }}</h2>
    <mat-dialog-content>{{ 'CONFIRM_DIALOG.MESSAGE' | translate }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'CONFIRM_DIALOG.CANCEL' | translate }}</button>
      <button mat-button color="warn" (click)="onConfirm()">{{ 'CONFIRM_DIALOG.DELETE' | translate }}</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,TranslateModule]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private translate: TranslateService  // Añadir TranslateService aquí
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
