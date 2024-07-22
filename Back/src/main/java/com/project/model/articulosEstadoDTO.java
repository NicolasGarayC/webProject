package com.project.model;

public class articulosEstadoDTO{
    private Integer id;
    private Integer estado;

    public articulosEstadoDTO(Integer id, Integer estado) {
        this.id = id;
        this.estado = estado;
    }

    public articulosEstadoDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}
