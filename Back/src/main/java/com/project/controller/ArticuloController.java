package com.project.controller;
import com.project.model.Articulo;
import com.project.model.ArticuloUpdateValorDTO;
import com.project.service.ArticuloService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {
    @Autowired
    private ArticuloService articuloService;

    @PostMapping("/registrarArticulo")
    public String agregarArticulo(@Valid @RequestBody Articulo articulo) {
        return "Los articulos deben crearse desde compras.";
    }

    @PutMapping("/updateValorUnitario")
    public ResponseEntity<String> updateValorUnitario(@Valid @RequestBody ArticuloUpdateValorDTO updateDTO) {
        if (articuloService.updateValorUnitario(updateDTO.getId(), updateDTO.getValorunitario())) {
            return ResponseEntity.ok("Valor unitario actualizado exitosamente.");
        } else {
            return ResponseEntity.badRequest().body("Error: ID de artículo no encontrado.");
        }
    }
}