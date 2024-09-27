package com.project.controller;

import com.project.model.Proveedor;
import com.project.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> getProveedorById(@PathVariable int id) {
        Optional<Proveedor> proveedor = proveedorRepository.findById((long) id);
        if (proveedor.isPresent()) {
            return ResponseEntity.ok(proveedor.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public List<Proveedor> getAllProveedores() {
        return proveedorRepository.findAll();
    }

    @PostMapping("/createProveedor")
    public ResponseEntity<Map<String, String>> createProveedor(@RequestBody Proveedor proveedor) {

        Proveedor existingProveedor = proveedorRepository.findByIdentificacion(proveedor.getIdentificacion());
        Map<String, String> response = new HashMap<>();

        if (existingProveedor != null) {
            response.put("error", "El proveedor ya se encuentra registrado.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } else {
            proveedorRepository.save(proveedor);
            response.put("message", "Proveedor creado exitosamente.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
    }

}