package com.project.controller;
import com.project.model.Articulo;
import com.project.model.ArticuloUpdateDTO;
import com.project.model.ArticuloUpdateValorDTO;
import com.project.model.Proveedor;
import com.project.repository.ArticuloRepository;
import com.project.service.ArticuloService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/articulos")
public class ArticuloController {
    @Autowired
    private ArticuloService articuloService;

    @PostMapping("/registrarArticulo")
    public ResponseEntity<Map<String, String>> agregarArticulo(@Valid @RequestBody Articulo articulo) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Los artículos deben crearse desde compras.");
        return ResponseEntity.badRequest().body(response);
    }


    @PutMapping("/updateValorUnitario")
    public ResponseEntity<Map<String, String>> updateValorUnitario(@Valid @RequestBody ArticuloUpdateValorDTO updateDTO) {
        Map<String, String> response = new HashMap<>();

        if (articuloService.updateValorUnitario(updateDTO.getId(), updateDTO.getValorunitario())) {
            response.put("message", "Valor unitario actualizado exitosamente.");
            return ResponseEntity.ok().body(response);
        } else {
            response.put("error", "Error: ID de artículo no encontrado.");
            return ResponseEntity.badRequest().body(response);
        }
    }


    @GetMapping("/getArticulos")
    public List<Articulo> getAll() {
        return articuloService.getAllArticulos();
    }

    @PutMapping("/actualizarArticulo")
    public ResponseEntity<Map<String, Object>> actualizarArticulo(@Valid @RequestBody ArticuloUpdateDTO articuloUpdateDTO) {
        Map<String, Object> response = new HashMap<>();

        try {
            Articulo articuloActualizado = articuloService.actualizarArticulo(articuloUpdateDTO);
            response.put("message", "Artículo actualizado exitosamente.");
            response.put("articulo", articuloActualizado);
            return ResponseEntity.ok().body(response);
        } catch (RuntimeException e) {
            response.put("error", "Error al actualizar el artículo: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }


    @DeleteMapping("/eliminarArticulo/{id}")
    public ResponseEntity<Map<String, String>> eliminarArticulo(@PathVariable int id) {
        Map<String, String> response = new HashMap<>();

        try {
            articuloService.eliminarArticuloPorId(id);
            response.put("message", "Artículo eliminado exitosamente.");
            return ResponseEntity.ok().body(response);
        } catch (RuntimeException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

}