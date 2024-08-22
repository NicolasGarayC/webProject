import { Component, OnInit } from '@angular/core';
import { ArticuloService } from '../../services/articles/articles.service';
import { Articulo } from '../../models/articulo.interface'
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ArticleDialogComponent } from '../../dialogs/article-dialog/article-dialog.component';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,CommonModule],
  styleUrls: ['./articles.component.css']
})

export class ArticlesComponent implements OnInit {
  articulos: Articulo[] = [];
  displayedColumns: string[] = ['nombrearticulo', 'marca', 'modelo', 'color', 'unidaddemedida', 'unidadesdisponibles', 'valorunitario', 'acciones'];
  isLoading: boolean = false
  constructor(private articlesService: ArticuloService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadArticulos();
  }

  loadArticulos(): void {
    this.isLoading = true
    this.articlesService.getArticulos().subscribe(
      {
        next: (data) => {
          this.articulos = data;
          this.isLoading = false
        },
        error: (error) => {
          this.isLoading = false
          console.error('Error fetching articulos', error);
        }
      }
    );
  }

  deleteArticulo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articlesService.deleteArticulo(id).subscribe(() => {
          this.loadArticulos();
        });
      }
    });
  }

  editArticulo(articulo: Articulo): void {
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: '400px',
      data: { ...articulo, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.articlesService.updateArticulo(result).subscribe(() => {
          this.loadArticulos();
        });
      }
    });
  }

  addArticulo(): void {
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: '400px',
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

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.articlesService.addArticulo(result).subscribe(() => {
          this.loadArticulos();
        });
      }
    });
  }
}
