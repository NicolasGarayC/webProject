import { Component, OnInit } from '@angular/core';
import { ArticuloService } from '../../services/articles/articles.service';
import { Articulo } from '../../models/articulo.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ArticleDialogComponent } from '../../dialogs/article-dialog/article-dialog.component';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { TranslateModule } from '@ngx-translate/core';  // Asegúrate de importar el TranslateModule

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatSnackBarModule,
    TranslateModule,  // Añadir el TranslateModule aquí
  ],
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articulos: MatTableDataSource<Articulo> = new MatTableDataSource<Articulo>();
  displayedColumns: string[] = [
    'nombrearticulo',
    'marca',
    'modelo',
    'color',
    'unidaddemedida',
    'unidadesdisponibles',
    'valorunitario',
    'acciones'
  ];
  isLoading: boolean = false;

  constructor(
    private articlesService: ArticuloService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadArticulos();
  }

  loadArticulos(): void {
    this.isLoading = true;
    this.articlesService.getArticulos().subscribe({
      next: (data) => {
        this.articulos.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching articulos', error);
      }
    });
  }

  deleteArticulo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articlesService.deleteArticulo(id).subscribe({
          next: () => {
            this.loadArticulos();
          },
          error: (error) => {
            this.loadArticulos();
            console.error('Error al eliminar el artículo', error);
          }
        });
      }
    });
  }

  editArticulo(articulo: Articulo): void {
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: '400px',
      data: { ...articulo, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articlesService.updateArticulo(result).subscribe({
          next: () => {
            this.loadArticulos();
            this.snackBar.open('Componente actualizado con exito.', 'Cerrar', {
              duration: 3000
            });
          },
          error: (error) => {
            this.loadArticulos();
            console.error('Error al actualizar el artículo', error);
          }
        });
      }
    });
  }

  addArticulo(): void {
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: '700px',
      height: '500px',
      data: {
        nombrearticulo: '',
        marca: '',
        modelo: '',
        color: '',
        unidaddemedida: '',
        unidadesdisponibles: 0,
        valorunitario: 0,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articlesService.addArticulo(result).subscribe({
          next: (res) => {
            if (res) {
              this.loadArticulos();
            }
          },
          error: (error) => {
            this.loadArticulos();
            console.error('Error al añadir el artículo', error);
          }
        });
      }
    });
  }
}
