import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ArticuloService } from '../../services/articles/articles.service';
import { Observable } from 'rxjs';
import { ArticuloData, Articulo } from '../../models/articulo.interface'

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
    MatSelectModule
  ]
})
export class ArticleDialogComponent implements OnInit {
  articuloForm: FormGroup;
  proveedores$: Observable<{ id: number, nombre: string }[]>;
  categorias$: Observable<{ id: number, nombreCategorias: string }[]>;

  constructor(
    public dialogRef: MatDialogRef<ArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArticuloData,
    private fb: FormBuilder,
    private articuloService: ArticuloService
  ) {
    console.log("data", data);

    this.articuloForm = this.fb.group({
      nombrearticulo: [data.nombrearticulo, Validators.required],
      marca: [data.marca, Validators.required],
      modelo: [data.modelo, Validators.required],
      color: [data.color, Validators.required],
      unidaddemedida: [data.unidaddemedida, Validators.required],
      unidadesdisponibles: [data.unidadesdisponibles, [Validators.required, Validators.min(0)]],
      valorunitario: [data.valorunitario, [Validators.required, Validators.min(0)]],
      proveedorId: [{ value: data.proveedorId }, Validators.required],
      categoriaId: [{ value: data.categoriaId }, Validators.required]
    });
    this.proveedores$ = this.articuloService.getProveedores();
    this.categorias$ = this.articuloService.getCategorias();
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.articuloForm.valid) {
      const formValue = this.articuloForm.getRawValue();
      if (this.data.isEdit) {
        if (this.data.id !== undefined) {
          const articuloUpdate: ArticuloData = {
            id: this.data.id,
            nombrearticulo: formValue.nombrearticulo,
            marca: formValue.marca,
            modelo: formValue.modelo,
            color: formValue.color,
            unidaddemedida: formValue.unidaddemedida,
            unidadesdisponibles: formValue.unidadesdisponibles,
            valorunitario: formValue.valorunitario,
            proveedorId: this.data.proveedorId,
            categoriaId: this.data.categoriaId,
            isEdit: true
          };
          this.articuloService.updateArticulo(articuloUpdate).subscribe(response => {
            this.dialogRef.close(response);
          });
        } else {
          console.error('El ID del artículo es undefined');
        }
      } else {
        const nuevaCompra = {
          articulosCompra: [
            {
              articulo: {
                nombrearticulo: formValue.nombrearticulo,
                marca: formValue.marca,
                modelo: formValue.modelo,
                color: formValue.color,
                unidaddemedida: formValue.unidaddemedida
              },
              unidadesCompradas: formValue.unidadesdisponibles,
              valorUnidad: formValue.valorunitario,
              idCategoria: this.data.categoriaId??1,
              estado: 1
            }
          ],
          idProveedor: this.data.proveedorId??1,
          idUsuario: 1
        };

        this.articuloService.registrarCompra(nuevaCompra).subscribe({
          next:(response)=>{
            console.log("entre");
            
            this.dialogRef.close(response);
          },          
          error:(error)=>{
            console.log("Error",error);
            
          }
        });
      }
    }
  }

}
