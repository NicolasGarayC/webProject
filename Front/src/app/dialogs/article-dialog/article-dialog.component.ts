import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ArticuloService } from '../../services/articles/articles.service';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-article-dialog',
  templateUrl: './article-dialog.component.html',
  styleUrls: ['./article-dialog.component.css'],
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

export class ArticleDialogComponent implements OnInit {
  compraForm: FormGroup;
  proveedores$: Observable<{ id: number, nombre: string }[]>;
  articulosData = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombrearticulo', 'marca', 'modelo', 'unidaddemedida', 'unidadesCompradas', 'valorUnidad'];
  articulos$: Observable<any[]>;
  articulosList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private articuloService: ArticuloService
  ) {
    this.compraForm = this.fb.group({
      proveedorId: [data.proveedorId ?? null, Validators.required],
      nuevoArticulo: [true],
      nombrearticulo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      unidaddemedida: ['', Validators.required],
      articuloExistenteId: [null],
      unidadesCompradas: [0, [Validators.required, Validators.min(1)]],
      valorUnidad: [0, [Validators.required, Validators.min(0)]],
    });

    if (data.isEdit) {
      this.compraForm.patchValue({
        nombrearticulo: data.nombrearticulo,
        marca: data.marca,
        modelo: data.modelo,
        color: data.color,
        unidaddemedida: data.unidaddemedida,
        unidadesCompradas: data.unidadesdisponibles,
        valorUnidad: data.valorunitario,
      });
    }

    this.proveedores$ = this.articuloService.getProveedores();
    this.articulos$ = this.articuloService.getArticulos();
  }

  ngOnInit(): void {
    this.articulos$.subscribe(data => {
      this.articulosList = data;
    });

    if (!this.data.isEdit) {
      this.compraForm.get('nuevoArticulo')?.valueChanges.subscribe((value) => {
        this.onNuevoArticuloChange(value);
      });

      this.onNuevoArticuloChange(this.compraForm.get('nuevoArticulo')?.value);
    }
  }

  onNuevoArticuloChange(isNuevoArticulo: boolean): void {
    if (isNuevoArticulo) {
      this.compraForm.get('nombrearticulo')?.setValidators(Validators.required);
      this.compraForm.get('marca')?.setValidators(Validators.required);
      this.compraForm.get('modelo')?.setValidators(Validators.required);
      this.compraForm.get('color')?.setValidators(Validators.required);
      this.compraForm.get('unidaddemedida')?.setValidators(Validators.required);
      this.compraForm.get('articuloExistenteId')?.clearValidators();
      this.compraForm.get('articuloExistenteId')?.setValue(null);
      this.compraForm.get('articuloExistenteId')?.updateValueAndValidity();
    } else {
      this.compraForm.get('articuloExistenteId')?.setValidators(Validators.required);
      this.compraForm.get('nombrearticulo')?.clearValidators();
      this.compraForm.get('marca')?.clearValidators();
      this.compraForm.get('modelo')?.clearValidators();
      this.compraForm.get('color')?.clearValidators();
      this.compraForm.get('unidaddemedida')?.clearValidators();

      this.compraForm.get('nombrearticulo')?.setValue('');
      this.compraForm.get('marca')?.setValue('');
      this.compraForm.get('modelo')?.setValue('');
      this.compraForm.get('color')?.setValue('');
      this.compraForm.get('unidaddemedida')?.setValue('');

      this.compraForm.get('nombrearticulo')?.updateValueAndValidity();
      this.compraForm.get('marca')?.updateValueAndValidity();
      this.compraForm.get('modelo')?.updateValueAndValidity();
      this.compraForm.get('color')?.updateValueAndValidity();
      this.compraForm.get('unidaddemedida')?.updateValueAndValidity();
    }

    this.compraForm.get('unidadesCompradas')?.setValue(0);
    this.compraForm.get('valorUnidad')?.setValue(0);
    this.compraForm.get('unidadesCompradas')?.updateValueAndValidity();
    this.compraForm.get('valorUnidad')?.updateValueAndValidity();
  }

  aceptarArticulo(): void {
    if (this.data.isEdit) return;

    this.compraForm.updateValueAndValidity();

    if (this.compraForm.valid) {
      const formValue = this.compraForm.value;
      let nuevoArticulo: any;

      if (formValue.nuevoArticulo) {
        nuevoArticulo = {
          articulo: {
            nombrearticulo: formValue.nombrearticulo,
            marca: formValue.marca,
            modelo: formValue.modelo,
            color: formValue.color,
            unidaddemedida: formValue.unidaddemedida,
          },
          unidadesCompradas: formValue.unidadesCompradas,
          valorUnidad: formValue.valorUnidad,
          idCategoria: 1,
          estado: 1,
        };
      } else {
        const articuloExistente = this.articulosList.find(articulo => articulo.id === formValue.articuloExistenteId);
        if (!articuloExistente) {
          this.snackBar.open('El artículo seleccionado no es válido..', 'Cerrar', {
            duration: 3000
          });
          return;
        }
        nuevoArticulo = {
          articulo: {
            nombrearticulo: articuloExistente.nombrearticulo,
            marca: articuloExistente.marca,
            modelo: articuloExistente.modelo,
            color: articuloExistente.color,
            unidaddemedida: articuloExistente.unidaddemedida,
          },
          unidadesCompradas: formValue.unidadesCompradas,
          valorUnidad: formValue.valorUnidad,
          idCategoria: 1,
          estado: 1,
        };
      }

      this.articulosData.data = [...this.articulosData.data, nuevoArticulo];

      if (formValue.nuevoArticulo) {
        this.compraForm.patchValue({
          nombrearticulo: '',
          marca: '',
          modelo: '',
          color: '',
          unidaddemedida: '',
        });
      } else {
        this.compraForm.patchValue({
          articuloExistenteId: null,
        });
      }
      this.compraForm.patchValue({
        unidadesCompradas: 0,
        valorUnidad: 0,
      });

    } else {
      this.snackBar.open('Por favor, complete todos los campos obligatorios.', 'Cerrar', {
        duration: 3000
      });
    }
  }

  guardarCompra(): void {
    
      const formValue = this.compraForm.value;
      if (this.data.isEdit) {
        const updatedArticulo = {
          id: this.data.id,
          nombrearticulo: formValue.nombrearticulo,
          marca: formValue.marca,
          modelo: formValue.modelo,
          color: formValue.color,
          unidaddemedida: formValue.unidaddemedida,
          unidadesdisponibles: formValue.unidadesCompradas,
          valorunitario: formValue.valorUnidad,
        };
        this.dialogRef.close(updatedArticulo);
      } else {
        if (this.articulosData.data.length > 0) {
          const nuevaCompra = {
            articulosCompra: this.articulosData.data,
            idProveedor: formValue.proveedorId,
            idUsuario: 1
          };
          this.articuloService.registrarCompra(nuevaCompra).subscribe(response => {
            this.dialogRef.close(response);
          });
        } else {
          this.snackBar.open('Por favor, complete todos los campos y agregue al menos un artículo.', 'Cerrar', {
            duration: 3000
          });
        }
      }

  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
