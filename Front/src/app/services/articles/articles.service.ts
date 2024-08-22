import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Articulo, ArticuloData } from '../../models/articulo.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  private apiUrl = `${environment.apiUrl}/articulos/getArticulos`;

  constructor(private http: HttpClient) { }

  getArticulos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(this.apiUrl);
  }

  deleteArticulo(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/articulos/eliminarArticulo/${id}`);
  }

  addArticulo(articulo: Articulo): Observable<Articulo> {
    return this.http.post<Articulo>(`${environment.apiUrl}/articulos`, articulo);
  }

  updateArticulo(articulo: ArticuloData): Observable<Articulo> {
    return this.http.put<Articulo>(`${environment.apiUrl}/articulos/actualizarArticulo`, articulo);
  }
  

  getProveedores(): Observable<{ id: number, nombre: string }[]> {
    return this.http.get<{ id: number, nombre: string }[]>(`${environment.apiUrl}/proveedores/all`);
  }

  getCategorias(): Observable<{ id: number, nombreCategorias: string }[]> {
    return this.http.get<{ id: number, nombreCategorias: string }[]>(`${environment.apiUrl}/categorias/all`);
  }

  registrarCompra(compra: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/compras/registrarCompra`, compra);
  }
}
