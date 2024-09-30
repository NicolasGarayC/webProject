export interface VentaArticuloDTO {
    id: number;
    fechaVenta: string;
    valorTotal: number;
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
  