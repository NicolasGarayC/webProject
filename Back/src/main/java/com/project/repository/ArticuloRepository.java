package com.project.repository;
import com.project.model.Articulo;
import com.project.model.ArticuloCategoria;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Integer> {

    Optional<Articulo> findByNombrearticuloIgnoreCaseAndMarcaIgnoreCaseAndModeloIgnoreCaseAndColorIgnoreCase(
            String nombrearticulo,
            String marca,
            String modelo,
            String color);


    @Modifying
    @Transactional
    @Query("UPDATE Articulo a SET a.unidadesdisponibles = :unidades WHERE a.id = :id")
    void updateUnidadesDisponiblesById(@Param("id") Integer id, @Param("unidades") int unidades);

    @Query("SELECT ac FROM ArticuloCategoria ac WHERE ac.idarticulo = :idart")
    Optional<ArticuloCategoria> selectCategoria(@Param("idart") Integer idart);

}
