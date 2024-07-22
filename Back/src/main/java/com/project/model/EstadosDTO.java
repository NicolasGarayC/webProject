package com.project.model;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class EstadosDTO {

    @NotNull(message = "El ID de operacion no puede ser nulo.")
    @Min(value = 1, message = "El ID de operacion debe ser un entero positivo.")
    private Integer operacion;

    @NotNull(message = "La lista de artículos devueltos no puede ser nula.")
    private List<articulosEstadoDTO> articulos;

    public EstadosDTO() {
    }

    public EstadosDTO(Integer operacion, List<articulosEstadoDTO> articulos) {
        this.operacion = operacion;
        this.articulos = articulos;
    }

    public Integer getOperacion() {
        return operacion;
    }

    public void setOperacion(Integer operacion) {
        this.operacion = operacion;
    }

    public List<articulosEstadoDTO> getArticulos() {
        return articulos;
    }

    public void setArticulos(List<articulosEstadoDTO> articulos) {
        this.articulos = articulos;
    }
}
