import { Component, OnInit } from '@angular/core';
import { ArticuloService } from '../../services/articles/articles.service';
import { Articulo } from '../../models/articulo.interface'
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  standalone:true,
  imports:[ MatTableModule ],
  styleUrls: ['./articles.component.css']
})

export class ArticlesComponent implements OnInit {
  articulos: Articulo[] = [];
  displayedColumns: string[] = ['nombrearticulo', 'marca', 'modelo', 'color', 'unidaddemedida', 'unidadesdisponibles', 'valorunitario', 'acciones'];

  constructor(private articlesService: ArticuloService) { }

  ngOnInit(): void {
    this.loadArticulos();
  }
  

  loadArticulos(): void {
    this.articlesService.getArticulos().subscribe(
      (data) => {
        this.articulos = data;
      },
      (error) => {
        console.error('Error fetching articulos', error);
      }
    );
  }

  deleteArticulo(id: number): void {
    this.articlesService.deleteArticulo(id).subscribe(() => {
      this.loadArticulos(); // Recargar la lista después de eliminar
    });
  }

  editArticulo(articulo: Articulo): void {
    // Implementar lógica para editar artículo
    console.log('Edit articulo', articulo);
  }

  addArticulo(): void {
    // Implementar lógica para añadir un nuevo artículo
    console.log('Add new articulo');
  }
}
