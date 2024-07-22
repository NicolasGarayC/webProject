package com.project.repository;

import com.project.model.Proveedor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    Proveedor findByIdentificacion(int identificacion);

    @Query(value = "SELECT a.nombrearticulo " +
            "FROM articulos a " +
            "JOIN compra_articulo ca ON a.id = ca.idarticulo " +
            "JOIN compra_proveedor cp ON ca.idcompra = cp.idcompra " +
            "WHERE cp.idproveedor = :proveedorId", nativeQuery = true)
    List<String> findTipoArticuloByProveedorId(@Param("proveedorId") Long proveedorId);
}