import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { VentaArticuloDTO, ReversionVentaDTO, EstadosDTO } from '../../models/sales.interface';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  createVenta(venta: VentaArticuloDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/nuevaVenta`, venta);
  }

  revertirVenta(reversion: ReversionVentaDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/devolucionVenta`, reversion);
  }

  actualizarEstadoVenta(estado: EstadosDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/estadoVenta`, estado);
  }

  getVentas(): Observable<VentaArticuloDTO[]> {
    // Método para obtener la lista de ventas
    return this.http.get<VentaArticuloDTO[]>(`${this.apiUrl}/getVentas`);
  }
  updateVenta(data:any):any{
    return null
  }
}
