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
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core'; // Importar TranslateService

import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentaArticuloDTO } from '../../models/sales.interface';

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
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule
  ]
})
export class VentaDialogComponent implements OnInit {
  ventaForm!: FormGroup;
  dtoarticulos = new MatTableDataSource<any>([])
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

  errorMessages: { [key: string]: { [key: string]: string } } = {
    articuloId: {
      required: 'VALIDATIONS.REQUIRED_FIELD'
    },
    cantidadVendida: {
      required: 'VALIDATIONS.REQUIRED_FIELD',
      min: 'VALIDATIONS.MIN_VALUE',
      max: 'VALIDATIONS.MAX_VALUE',
      pattern: 'VALIDATIONS.ONLY_NUMBERS'
    }
  };

  constructor(
    public dialogRef: MatDialogRef<VentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ventaService: VentaService,
    private articuloService: ArticuloService,
    private translate: TranslateService  // Añadir TranslateService
  ) {
    this.isEdit = data.isEdit;

    if (this.isEdit) {
      // Poblar la tabla si es edición
      this.articulosData.data = data.articulos;
    }
    this.initForm();
    this.articulos$ = this.articuloService.getArticulos();
  }

  ngOnInit(): void {
    this.articulos$.subscribe((data) => {
      this.articulosList = data;
    });
  }

  private initForm(): void {
    const numberPattern = '^[0-9]*$';
    const decimalPattern = '^[0-9]+(.[0-9]{1,2})?$';

    this.ventaForm = this.fb.group({
      articuloId: [
        null, 
        [Validators.required]
      ],
      cantidadVendida: [
        0, 
        [
          Validators.required, 
          Validators.min(1),
          Validators.max(99999),
          Validators.pattern(numberPattern)
        ]
      ]
    });
  }

  agregarArticulo(): void {
    this.ventaForm.markAllAsTouched();

    if (this.ventaForm.valid) {
      const formValue = this.ventaForm.value;
      const articulo = this.articulosList.find((art) => art.id === formValue.articuloId);

      if (!articulo) {
        this.translate.get('SALES.VALIDATION.INVALID_ARTICLE').subscribe((res: string) => {
          // Usar MatSnackBar en lugar de alert
          this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), {
            duration: 3000
          });
        });
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

      const dtoArticulo = {
        unidadesVendidas: formValue.cantidadVendida,
        estado:2,
        articulo: articulo.id,
      };
      this.dtoarticulos.data = [...this.dtoarticulos.data, dtoArticulo];
      this.articulosData.data = [...this.articulosData.data, nuevoArticulo];

      // Reiniciar el formulario
      this.ventaForm.reset({
        articuloId: null,
        cantidadVendida: 0,
      });
    } else {
      alert(this.translate.instant('VENTA_DIALOG.FILL_FIELDS')); // Mensaje traducido
    }
  }
  getErrorMessage(controlName: string): string {
    const control = this.ventaForm.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      const errorKey = Object.keys(control.errors)[0];
      let params = {};
  
      switch (errorKey) {
        case 'min':
          params = { value: control.errors[errorKey].min };
          break;
        case 'max':
          params = { value: control.errors[errorKey].max };
          break;
      }
  
      return this.translate.instant(this.errorMessages[controlName][errorKey], params);
    }
    return '';
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
          articulosVenta: this.dtoarticulos.data,
          idUsuario: 16,
          idCliente:1
        };
        this.ventaService.createVenta(nuevaVenta).subscribe({
          next: (res) => {
            if(res){
              this.dialogRef.close(true);
            }
          },
          error: (error) => {
            this.snackBar.open(error.error.error, this.translate.instant('SALES.SNACKBAR_CLOSE'), {
              duration: 3000,
            });
            console.error('Error al registrar la venta', error);
          },
        });
        } else {
        alert(this.translate.instant('VENTA_DIALOG.ADD_ARTICLE')); // Mensaje traducido
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
