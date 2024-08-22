package com.project.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class ArticuloUpdateDTO {

    private int id;

    @NotBlank(message = "El nombre del artículo no puede estar vacío.")
    private String nombrearticulo;

    @NotBlank(message = "La marca no puede estar vacía.")
    private String marca;

    @NotBlank(message = "El modelo no puede estar vacío.")
    private String modelo;

    @NotBlank(message = "El color no puede estar vacío.")
    private String color;

    @NotBlank(message = "La unidad de medida no puede estar vacía.")
    private String unidaddemedida;

    @PositiveOrZero(message = "Las unidades disponibles no pueden ser negativas.")
    private int unidadesdisponibles;

    @PositiveOrZero(message = "El valor unitario no puede ser negativo.")
    private double valorunitario;

    private int proveedorId;
    private int categoriaId;

    public ArticuloUpdateDTO() {
    }

    public ArticuloUpdateDTO(int id, String nombrearticulo, String marca, String modelo, String color, String unidaddemedida, int unidadesdisponibles, double valorunitario, int proveedorId, int categoriaId) {
        this.id = id;
        this.nombrearticulo = nombrearticulo;
        this.marca = marca;
        this.modelo = modelo;
        this.color = color;
        this.unidaddemedida = unidaddemedida;
        this.unidadesdisponibles = unidadesdisponibles;
        this.valorunitario = valorunitario;
        this.proveedorId = proveedorId;
        this.categoriaId = categoriaId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombrearticulo() {
        return nombrearticulo;
    }

    public void setNombrearticulo(String nombrearticulo) {
        this.nombrearticulo = nombrearticulo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getUnidaddemedida() {
        return unidaddemedida;
    }

    public void setUnidaddemedida(String unidaddemedida) {
        this.unidaddemedida = unidaddemedida;
    }

    public int getUnidadesdisponibles() {
        return unidadesdisponibles;
    }

    public void setUnidadesdisponibles(int unidadesdisponibles) {
        this.unidadesdisponibles = unidadesdisponibles;
    }

    public double getValorunitario() {
        return valorunitario;
    }

    public void setValorunitario(double valorunitario) {
        this.valorunitario = valorunitario;
    }

    public int getProveedorId() {
        return proveedorId;
    }

    public void setProveedorId(int proveedorId) {
        this.proveedorId = proveedorId;
    }

    public int getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(int categoriaId) {
        this.categoriaId = categoriaId;
    }
}
