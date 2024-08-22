package com.project.model;
import jakarta.validation.constraints.*;
public class ArticuloUpdateValorDTO {

    private Integer id;

    @PositiveOrZero(message = "El valor unitario no puede ser negativo.")
    private double valorunitario;


    public ArticuloUpdateValorDTO() {
    }

    public ArticuloUpdateValorDTO(Integer id, double valorunitario) {
        this.id = id;
        this.valorunitario = valorunitario;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getValorunitario() {
        return valorunitario;
    }

    public void setValorunitario(double valorunitario) {
        this.valorunitario = valorunitario;
    }
}
