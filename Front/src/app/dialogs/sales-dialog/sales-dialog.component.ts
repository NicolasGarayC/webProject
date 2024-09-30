import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { VentaService } from '../../services/sales/sales.service';
import { ArticuloService } from '../../services/articles/articles.service';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-venta-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule
  ]

})
export class VentaDialogComponent implements OnInit {
  ventaForm: FormGroup;
  articulos$: Observable<any[]>;
  articulosList: any[] = [];
  articulosData = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombrearticulo', 'marca', 'modelo', 'unidaddemedida', 'cantidadVendida', 'valorUnitario'];
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<VentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private ventaService: VentaService,
    private articuloService: ArticuloService
  ) {
    this.isEdit = data.isEdit;
    this.ventaForm = this.fb.group({
      articuloId: [null, Validators.required],
      cantidadVendida: [0, [Validators.required, Validators.min(1)]],
      valorUnitario: [0, [Validators.required, Validators.min(0)]],
    });

    if (this.isEdit) {
      // Populate form if editing
      this.articulosData.data = data.articulos;
    }

    this.articulos$ = this.articuloService.getArticulos();
  }

  ngOnInit(): void {
    this.articulos$.subscribe((data) => {
      this.articulosList = data;
    });
  }

  agregarArticulo(): void {
    if (this.ventaForm.valid) {
      const formValue = this.ventaForm.value;
      const articulo = this.articulosList.find((art) => art.id === formValue.articuloId);

      if (!articulo) {
        alert('Artículo seleccionado no es válido.');
        return;
      }

      const nuevoArticulo = {
        articulo: {
          nombrearticulo: articulo.nombrearticulo,
          marca: articulo.marca,
          modelo: articulo.modelo,
          color: articulo.color,
          unidaddemedida: articulo.unidaddemedida,
        },
        cantidadVendida: formValue.cantidadVendida,
        valorUnitario: formValue.valorUnitario,
        idArticulo: articulo.id,
      };

      this.articulosData.data = [...this.articulosData.data, nuevoArticulo];

      // Reset form fields
      this.ventaForm.reset({
        articuloId: null,
        cantidadVendida: 0,
        valorUnitario: 0,
      });
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
    }
  }

  guardarVenta(): void {
    if (this.isEdit) {
      // Prepare data for updating
      const updatedVenta = {
        id: this.data.id,
        fecha: this.data.fecha,
        total: this.data.total,
        articulos: this.articulosData.data,
      };
      this.dialogRef.close(updatedVenta);
    } else {
      if (this.articulosData.data.length > 0) {
        const nuevaVenta = {
          articulos: this.articulosData.data,
          idUsuario: 1, // Replace with actual user ID
        };
        this.dialogRef.close(nuevaVenta);
      } else {
        alert('Por favor, agregue al menos un artículo a la venta.');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
