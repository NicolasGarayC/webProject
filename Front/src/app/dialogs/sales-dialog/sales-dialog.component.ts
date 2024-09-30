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
import { TranslateService } from '@ngx-translate/core'; // Importar TranslateService

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-venta-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
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
  displayedColumns: string[] = [
    'nombrearticulo', 
    'marca', 
    'modelo', 
    'unidaddemedida', 
    'cantidadVendida', 
    'valorUnitario'
  ];
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<VentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private ventaService: VentaService,
    private articuloService: ArticuloService,
    private translate: TranslateService  // Añadir TranslateService
  ) {
    this.isEdit = data.isEdit;
    this.ventaForm = this.fb.group({
      articuloId: [null, Validators.required],
      cantidadVendida: [0, [Validators.required, Validators.min(1)]],
      valorUnitario: [0, [Validators.required, Validators.min(0)]],
    });

    if (this.isEdit) {
      // Poblar la tabla si es edición
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
        alert(this.translate.instant('VENTA_DIALOG.INVALID_ARTICLE')); // Mensaje traducido
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

      // Reiniciar el formulario
      this.ventaForm.reset({
        articuloId: null,
        cantidadVendida: 0,
        valorUnitario: 0,
      });
    } else {
      alert(this.translate.instant('VENTA_DIALOG.FILL_FIELDS')); // Mensaje traducido
    }
  }

  guardarVenta(): void {
    if (this.isEdit) {
      // Preparar datos para actualizar
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
          idUsuario: 1, // Reemplazar con el ID de usuario real
        };
        this.dialogRef.close(nuevaVenta);
      } else {
        alert(this.translate.instant('VENTA_DIALOG.ADD_ARTICLE')); // Mensaje traducido
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
