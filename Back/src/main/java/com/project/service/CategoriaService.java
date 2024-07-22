
package com.project.service;
import com.project.model.Categoria;
import com.project.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

    @Service
    public class CategoriaService {

        @Autowired
        private CategoriaRepository categoriaRepository;

        public Optional<Categoria> findByName(String nombreCategorias) {
            return categoriaRepository.findByNombreCategorias(nombreCategorias);
        }

        public Categoria createCategoria(Categoria categoria) {
            return categoriaRepository.save(categoria);
        }
    }