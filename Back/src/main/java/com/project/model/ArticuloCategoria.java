package com.project.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "articulo_categoria")
public class ArticuloCategoria {

    @Id
    private Integer id;

    private Integer idarticulo;

    private Integer idcategoria;

    // Constructor vacío (necesario para JPA)
    public ArticuloCategoria() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // Constructor con parámetros


    public ArticuloCategoria(Integer id, Integer idarticulo, Integer idcategoria) {
        this.id = id;
        this.idarticulo = idarticulo;
        this.idcategoria = idcategoria;
    }

    // Getters y setters
    public Integer getIdarticulo() {
        return idarticulo;
    }

    public void setIdarticulo(Integer idarticulo) {
        this.idarticulo = idarticulo;
    }

    public Integer getIdcategoria() {
        return idcategoria;
    }

    public void setIdcategoria(Integer idcategoria) {
        this.idcategoria = idcategoria;
    }
}

