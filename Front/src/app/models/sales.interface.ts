export interface VentaArticuloDTO {
    id: number;
    fecha: string;
    total: number;
    articulos: any[];
  }
  
  export interface ReversionVentaDTO {
    idVenta: number;
  }
  
  export interface EstadosDTO {
    operacion: number;
    articulos: articulosEstadoDTO[];
  }
  
  export interface articulosEstadoDTO {
    idArticulo: number;
    estado: string;
  }
  