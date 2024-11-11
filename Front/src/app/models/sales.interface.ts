export interface VentaArticuloDTO {
    id?: number;
    fechaVenta?: string;
    valorTotal?: number;
    articulos?: any[];
    idUsuario?:number
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
  