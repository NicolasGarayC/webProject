package com.project.model;

import jakarta.validation.constraints.*;
import java.util.List;

public class CompraArticulosDTO {

    @NotEmpty(message = "La lista de artículos no puede estar vacía.")
    private List<ArticulosCompraDTO> articulosCompra;

    @NotNull(message = "El ID del usuario no puede ser nulo.")
    @Min(value = 1, message = "El ID del usuario debe ser un entero positivo.")
    private Integer idUsuario;

    @NotNull(message = "El ID del proveedor no puede ser nulo.")
    @Min(value = 1, message = "El ID del proveedor debe ser un entero positivo.")
    private Integer idProveedor;

    public CompraArticulosDTO(List<ArticulosCompraDTO> articulosCompra, Integer idUsuario, Integer idProveedor) {
        this.articulosCompra = articulosCompra;
        this.idUsuario = idUsuario;
        this.idProveedor = idProveedor;
    }

    public CompraArticulosDTO() {
    }

    public Integer getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(Integer idProveedor) {
        this.idProveedor = idProveedor;
    }

    public List<ArticulosCompraDTO> getArticulosCompra() {
        return articulosCompra;
    }

    public void setArticulosCompra(List<ArticulosCompraDTO> articulosCompra) {
        this.articulosCompra = articulosCompra;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}
