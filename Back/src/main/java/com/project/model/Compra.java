package com.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "compras")
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @PositiveOrZero(message = "El valor total no puede ser negativo.")
    private double valortotal;

    @PastOrPresent(message = "La fecha de compra no puede estar en el futuro.")
    private Date fechacompra;

    public Compra() {
        this.fechacompra = new Date();
    }

    public Compra(double valortotal) {
        this.valortotal = valortotal;
        this.fechacompra = new Date();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getValortotal() {
        return valortotal;
    }

    public void setValortotal(double valortotal) {
        this.valortotal = valortotal;
    }

    public Date getFechacompra() {
        return fechacompra;
    }

    public void setFechacompra(Date fechacompra) {
        this.fechacompra = fechacompra;
    }

    public LocalDate getFecha() {
        return null;
    }

    public LocalDate getFechaCompra() {
        return null;
    }
}
