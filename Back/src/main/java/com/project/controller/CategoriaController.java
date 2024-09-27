package com.project.controller;
import com.project.model.Categoria;
import com.project.model.Proveedor;
import com.project.repository.CategoriaRepository;
import com.project.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias")
public class  CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @PostMapping("/createCategoria")
    public ResponseEntity<Map<String, String>> createCategoria(@RequestBody Categoria categoria) {
        Map<String, String> response = new HashMap<>();
        try {
            if (categoriaService.findByName(categoria.getNombreCategorias()).isPresent()) {
                response.put("error", "Ya existe una categoría con este nombre");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            categoriaService.createCategoria(new Categoria(categoria.getNombreCategorias()));
            response.put("message", "Categoria se creó satisfactoriamente");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "Ocurrió un error durante el registro");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/all")
    public List<Categoria> getAllProveedores() {
        return categoriaRepository.findAll();
    }

}