package com.project.controller;
import com.project.model.Categoria;
import com.project.repository.CategoriaRepository;
import com.project.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categorias")
public class  CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @PostMapping("/createCategoria")
    public ResponseEntity<String> createCategoria(@RequestBody Categoria categoria) {
        try {
            if (categoriaService.findByName(categoria.getNombreCategorias()).isPresent()) {
                return new ResponseEntity<>("Ya existe una categoría con este nombre", HttpStatus.CONFLICT);
            }

            categoriaService.createCategoria(new Categoria(categoria.getNombreCategorias()));

            return new ResponseEntity<>("Categoria se creó satisfactoriamente", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Ocurrio un error durante el registro", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}