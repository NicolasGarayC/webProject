export interface Articulo {
  id: number;
  nombrearticulo: string;
  marca: string;
  modelo: string;
  color: string;
  unidaddemedida: string;
  unidadesdisponibles: number;
  valorunitario: number;
}
export interface ArticuloData {
  id?: number;
  nombrearticulo: string;
  marca: string;
  modelo: string;
  color: string;
  unidaddemedida: string;
  unidadesdisponibles: number;
  valorunitario: number;
  proveedorId?: number;
  categoriaId?: number;
  isEdit: boolean;
}