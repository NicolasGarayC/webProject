package com.project.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class ArticulosCompraDTO {

    @NotNull(message = "El artículo no puede ser nulo.")
    private Articulo articulo;

    @Min(value = 0, message = "Las unidades compradas no pueden ser negativas.")
    private int unidadesCompradas;

    @PositiveOrZero(message = "El valor por unidad no puede ser negativo.")
    private double valorUnidad;

    @PositiveOrZero(message = "El valor total no puede ser negativo.")
    private double valorTotal;

    @NotNull(message = "El ID de la categoría no puede ser nulo.")
    private Integer idCategoria;
    @NotNull(message = "El estado no puede ser nulo.")
    private Integer estado;

    public ArticulosCompraDTO(Articulo articulo, int unidadesCompradas, double valorUnidad, Integer idCategoria,Integer estado) {
        this.articulo = articulo;
        this.estado = estado;
        this.unidadesCompradas = unidadesCompradas;
        this.valorUnidad = valorUnidad;
        this.idCategoria = idCategoria;
        this.valorTotal = (unidadesCompradas*valorUnidad);
    }

    public ArticulosCompraDTO() {
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }
    public Articulo getArticulo() {
        return articulo;
    }

    public void setArticulo(Articulo articulo) {
        this.articulo = articulo;
    }

    public int getUnidadesCompradas() {
        return unidadesCompradas;
    }

    public void setUnidadesCompradas(int unidadesCompradas) {
        this.unidadesCompradas = unidadesCompradas;
    }

    public double getValorUnidad() {
        return valorUnidad;
    }

    public void setValorUnidad(double valorUnidad) {
        this.valorUnidad = valorUnidad;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public Integer getEstado() {return estado;}

    public void setEstado(Integer estado) {this.estado = estado;}
}
