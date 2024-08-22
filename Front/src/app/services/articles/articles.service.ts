import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Articulo } from '../../models/articulo.interface'
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
    return this.http.delete<void>(`${environment.apiUrl}/articulos/${id}`);
  }

  addArticulo(articulo: Articulo): Observable<Articulo> {
    return this.http.post<Articulo>(`${environment.apiUrl}/articulos`, articulo);
  }

  updateArticulo(id: number, articulo: Articulo): Observable<Articulo> {
    return this.http.put<Articulo>(`${environment.apiUrl}/articulos/${id}`, articulo);
  }
}
