import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentaService } from '../../services/sales/sales.service';
import { VentaArticuloDTO } from '../../models/sales.interface';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { VentaDialogComponent } from '../../dialogs/sales-dialog/sales-dialog.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';  // Importa TranslateService
import { TranslateModule } from '@ngx-translate/core';  // Asegúrate de importar el TranslateModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['sales.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTableModule,
    TranslateModule

  ]
})
export class VentasComponent implements OnInit {
  sales: MatTableDataSource<VentaArticuloDTO> = new MatTableDataSource<VentaArticuloDTO>();
  displayedColumns: string[] = ['id', 'fecha', 'total', 'acciones'];
  isLoading: boolean = false;

  constructor(
    private ventaService: VentaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService  // Añade TranslateService aquí
  ) {}

  ngOnInit(): void {
    this.loadVentas();
  }

  loadVentas(): void {
    this.isLoading = true;
    this.ventaService.getVentas().subscribe({
      next: (data: any) => {
        this.sales.data = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.snackBar.open(this.translate.instant('SALES.ERROR_LOAD'), this.translate.instant('SALES.SNACKBAR_CLOSE'), {
          duration: 3000,
        });
        console.error('Error fetching sales', error);
      },
    });
  }

  deleteVenta(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ventaService.revertirVenta({ idVenta: id }).subscribe({
          next: () => {
            this.loadVentas();
          },
          error: (error) => {
            this.snackBar.open(this.translate.instant('SALES.ERROR_REVERT'), this.translate.instant('SALES.SNACKBAR_CLOSE'), {
              duration: 3000,
            });
            console.error('Error al revertir la venta', error);
          },
        });
      }
    });
  }

  addVenta(): void {
    const dialogRef = this.dialog.open(VentaDialogComponent, {
      width: '700px',
      height: '500px',
      data: { isEdit: false },
    });

    dialogRef.afterClosed().subscribe((result: VentaArticuloDTO) => {
      if (result) {
        this.ventaService.createVenta(result).subscribe({
          next: () => {
            this.loadVentas();
          },
          error: (error) => {
            this.snackBar.open(this.translate.instant('SALES.ERROR_REGISTER'), this.translate.instant('SALES.SNACKBAR_CLOSE'), {
              duration: 3000,
            });
            console.error('Error al registrar la venta', error);
          },
        });
      }
    });
  }

  formatFecha(fecha: string): string {
    return fecha ? fecha.split('T')[0] : '';
  }

  editVenta(sale: VentaArticuloDTO): void {
    const dialogRef = this.dialog.open(VentaDialogComponent, {
      width: '700px',
      height: '500px',
      data: { ...sale, isEdit: true },
    });

    dialogRef.afterClosed().subscribe((result: VentaArticuloDTO) => {
      if (result) {
        this.ventaService.updateVenta(result).subscribe({
          next: () => {
            this.loadVentas();
          },
          error: (error: any) => {
            this.snackBar.open(this.translate.instant('SALES.ERROR_UPDATE'), this.translate.instant('SALES.SNACKBAR_CLOSE'), {
              duration: 3000,
            });
            console.error('Error al actualizar la venta', error);
          },
        });
      }
    });
  }
}
