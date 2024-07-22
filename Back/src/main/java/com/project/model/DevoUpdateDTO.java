package com.project.model;

import jakarta.validation.constraints.*;

import java.util.ArrayList;

public class DevoUpdateDTO {

    @NotNull(message = "El ID de compra no puede ser nulo.")
    @Min(value = 1, message = "El ID de compra debe ser un entero positivo.")
    private Integer idCompra;

    @NotBlank(message = "La descripción no puede estar vacía.")
    private String descripcion;

    @NotNull(message = "La lista de artículos devueltos no puede ser nula.")
    private ArrayList devuelto;

    public DevoUpdateDTO() {
    }

    public DevoUpdateDTO(Integer idCompra, String descripcion, ArrayList devuelto) {
        this.idCompra = idCompra;
        this.descripcion = descripcion;
        this.devuelto = devuelto;
    }
    public Integer getIdCompra() {
        return idCompra;
    }

    public void setIdCompra(Integer idCompra) {
        this.idCompra = idCompra;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public ArrayList getDevuelto() {
        return devuelto;
    }

    public void setDevuelto(ArrayList devuelto) {
        this.devuelto = devuelto;
    }
}
