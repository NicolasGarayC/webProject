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
import { TranslateService } from '@ngx-translate/core';  // Importar TranslateService
import { TranslateModule } from '@ngx-translate/core';

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
    MatTableModule,
    TranslateModule
  ]
})

export class ArticleDialogComponent implements OnInit {
  compraForm!: FormGroup;
  proveedores$: Observable<{ id: number, nombre: string }[]>;
  articulosData = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombrearticulo', 'marca', 'modelo', 'unidaddemedida', 'unidadesCompradas', 'valorUnidad'];
  articulos$: Observable<any[]>;
  articulosList: any[] = [];
  errorMessages: { [key: string]: { [key: string]: string } } = {
    nombrearticulo: {
      required: 'VALIDATORS.NAME_REQUIRED',
      maxlength: 'VALIDATORS.NAME_MAX_LENGTH',
      pattern: 'VALIDATORS.NAME_PATTERN'
    },
    marca: {
      required: 'VALIDATORS.BRAND_REQUIRED',
      maxlength: 'VALIDATORS.BRAND_MAX_LENGTH'
    },
    modelo: {
      required: 'VALIDATORS.MODEL_REQUIRED',
      maxlength: 'VALIDATORS.MODEL_MAX_LENGTH'
    },
    color: {
      required: 'VALIDATORS.COLOR_REQUIRED',
      maxlength: 'VALIDATORS.COLOR_MAX_LENGTH'
    },
    unidaddemedida: {
      required: 'VALIDATORS.UNIT_REQUIRED',
      maxlength: 'VALIDATORS.UNIT_MAX_LENGTH'
    },
    unidadesCompradas: {
      required: 'VALIDATORS.UNITS_REQUIRED',
      min: 'VALIDATORS.UNITS_MIN',
      max: 'VALIDATORS.UNITS_MAX',
      pattern: 'VALIDATORS.UNITS_PATTERN'
    },
    valorUnidad: {
      required: 'VALIDATORS.PRICE_REQUIRED',
      min: 'VALIDATORS.PRICE_MIN',
      max: 'VALIDATORS.PRICE_MAX',
      pattern: 'VALIDATORS.PRICE_PATTERN'
    },
    proveedorId: {
      required: 'VALIDATORS.SUPPLIER_REQUIRED'
    },
    articuloExistenteId: {
      required: 'VALIDATORS.EXISTING_ARTICLE_REQUIRED'
    }
  };

  constructor(
    public dialogRef: MatDialogRef<ArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private articuloService: ArticuloService,
    private translate: TranslateService  // Añadir TranslateService aquí
  ) {
    this.initForm();
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

  private initForm(): void {
    const numberPattern = '^[0-9]*$';
    const decimalPattern = '^[0-9]+(.[0-9]{1,2})?$';
    const namePattern = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$';

    this.compraForm = this.fb.group({
      proveedorId: [
        this.data.proveedorId ?? null, 
        [Validators.required]
      ],
      nuevoArticulo: [true],
      nombrearticulo: [
        '', 
        [
          Validators.required, 
          Validators.maxLength(100),
          Validators.pattern(namePattern)
        ]
      ],
      marca: [
        '', 
        [
          Validators.required, 
          Validators.maxLength(50)
        ]
      ],
      modelo: [
        '', 
        [
          Validators.required, 
          Validators.maxLength(50)
        ]
      ],
      color: [
        '', 
        [
          Validators.required, 
          Validators.maxLength(30)
        ]
      ],
      unidaddemedida: [
        '', 
        [
          Validators.required, 
          Validators.maxLength(20)
        ]
      ],
      articuloExistenteId: [null],
      unidadesCompradas: [
        0, 
        [
          Validators.required,
          Validators.min(1),
          Validators.max(99999),
          Validators.pattern(numberPattern)
        ]
      ],
      valorUnidad: [
        0, 
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(9999999.99),
          Validators.pattern(decimalPattern)
        ]
      ],
    });

    if (this.data.isEdit) {
      this.patchFormValues();
    }
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
          this.translate.get('ARTICLE.INVALID_ARTICLE').subscribe((res: string) => {
            this.snackBar.open(res, this.translate.instant('ARTICLE.CLOSE'), {
              duration: 3000
            });
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
      this.translate.get('ARTICLE.FILL_REQUIRED_FIELDS').subscribe((res: string) => {
        this.snackBar.open(res, this.translate.instant('ARTICLE.CLOSE'), {
          duration: 3000
        });
      });
    }
  }
  
  private patchFormValues(): void {
    this.compraForm.patchValue({
      nombrearticulo: this.data.nombrearticulo,
      marca: this.data.marca,
      modelo: this.data.modelo,
      color: this.data.color,
      unidaddemedida: this.data.unidaddemedida,
      unidadesCompradas: this.data.unidadesdisponibles,
      valorUnidad: this.data.valorunitario,
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.compraForm.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      const errorKey = Object.keys(control.errors)[0];
      return this.translate.instant(this.errorMessages[controlName][errorKey]);
    }
    return '';
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
        this.translate.get('ARTICLE.ADD_AT_LEAST_ONE').subscribe((res: string) => {
          this.snackBar.open(res, this.translate.instant('ARTICLE.CLOSE'), {
            duration: 3000
          });
        });
      }
    }
  }

  onNuevoArticuloChange(isNuevoArticulo: boolean): void {
    const numberPattern = '^[0-9]*$';
    const decimalPattern = '^[0-9]+(.[0-9]{1,2})?$';
    const namePattern = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$';

    if (isNuevoArticulo) {
      this.compraForm.get('nombrearticulo')?.setValidators([
        Validators.required, 
        Validators.maxLength(100),
        Validators.pattern(namePattern)
      ]);
      this.compraForm.get('marca')?.setValidators([
        Validators.required, 
        Validators.maxLength(50)
      ]);
      this.compraForm.get('modelo')?.setValidators([
        Validators.required, 
        Validators.maxLength(50)
      ]);
      this.compraForm.get('color')?.setValidators([
        Validators.required, 
        Validators.maxLength(30)
      ]);
      this.compraForm.get('unidaddemedida')?.setValidators([
        Validators.required, 
        Validators.maxLength(20)
      ]);
      this.compraForm.get('articuloExistenteId')?.clearValidators();
    } else {
      this.compraForm.get('articuloExistenteId')?.setValidators([
        Validators.required
      ]);
      this.compraForm.get('nombrearticulo')?.clearValidators();
      this.compraForm.get('marca')?.clearValidators();
      this.compraForm.get('modelo')?.clearValidators();
      this.compraForm.get('color')?.clearValidators();
      this.compraForm.get('unidaddemedida')?.clearValidators();
    }

    // Resetear valores y actualizar validaciones
    ['nombrearticulo', 'marca', 'modelo', 'color', 'unidaddemedida', 'articuloExistenteId'].forEach(field => {
      const control = this.compraForm.get(field);
      control?.setValue('');
      control?.updateValueAndValidity();
    });

    // Resetear y actualizar campos numéricos
    this.compraForm.patchValue({
      unidadesCompradas: 0,
      valorUnidad: 0
    });

    this.compraForm.get('unidadesCompradas')?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(99999),
      Validators.pattern(numberPattern)
    ]);

    this.compraForm.get('valorUnidad')?.setValidators([
      Validators.required,
      Validators.min(0.01),
      Validators.max(9999999.99),
      Validators.pattern(decimalPattern)
    ]);

    this.compraForm.updateValueAndValidity();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
