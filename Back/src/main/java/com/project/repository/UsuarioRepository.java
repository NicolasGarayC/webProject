package com.project.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.model.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    boolean existsByCorreo(String correo);

    boolean existsByCedula(int cedula);

    Optional<Usuario> findByCorreo(String correo);

    Optional<Usuario> findByToken(Integer token);
}