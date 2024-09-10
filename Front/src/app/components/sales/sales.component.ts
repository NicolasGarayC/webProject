import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VentaService } from '../../services/sales/sales.service';
import { VentaArticuloDTO } from '../../models/sales.interface';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  styleUrls: ['sales.component.css'],
})
export class VentasComponent implements OnInit {
  sales: MatTableDataSource<VentaArticuloDTO> = new MatTableDataSource<VentaArticuloDTO>();
  displayedColumns: string[] = ['id', 'fecha', 'total', 'acciones'];
  isLoading: boolean = false;

  constructor(
    private ventaService: VentaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVentas();
  }

  loadVentas(): void {
    this.isLoading = true;
    this.ventaService.getVentas().subscribe({
      next: (data:any) => {
        this.sales.data = data;
        this.isLoading = false;
      },
      error: (error:any) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar las sales.', 'Cerrar', {
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
            this.snackBar.open('Error al revertir la sale.', 'Cerrar', {
              duration: 3000,
            });
            console.error('Error al revertir la sale', error);
          },
        });
      }
    });
  }

  addVenta(): void {
    // const dialogRef = this.dialog.open(VentaDialogComponent, {
    //   width: '400px',
    //   data: { isEdit: false },
    // });

    // dialogRef.afterClosed().subscribe((result: VentaArticuloDTO) => {
    //   if (result) {
    //     this.ventaService.createVenta(result).subscribe({
    //       next: () => {
    //         this.loadVentas();
    //       },
    //       error: (error) => {
    //         this.snackBar.open('Error al registrar la sale.', 'Cerrar', {
    //           duration: 3000,
    //         });
    //         console.error('Error al registrar la sale', error);
    //       },
    //     });
    //   }
    // });
  }

  editVenta(sale: VentaArticuloDTO): void {
    // const dialogRef = this.dialog.open(VentaDialogComponent, {
    //   width: '400px',
    //   data: { ...sale, isEdit: true },
    // });

    // dialogRef.afterClosed().subscribe((result: VentaArticuloDTO) => {
    //   if (result) {
    //     this.ventaService.actualizarEstadoVenta({ operacion: result.id, articulos: result.articulos }).subscribe({
    //       next: () => {
    //         this.loadVentas();
    //       },
    //       error: (error) => {
    //         this.snackBar.open('Error al actualizar la sale.', 'Cerrar', {
    //           duration: 3000,
    //         });
    //         console.error('Error al actualizar la sale', error);
    //       },
    //     });
    //   }
    // });
  }
}
