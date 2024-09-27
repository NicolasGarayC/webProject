package com.project.controller;

import com.project.model.Cliente;
import com.project.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping("/{id}")
    public Cliente obtenerClientePorId(@PathVariable Long id) {
        return clienteService.obtenerClientePorId(id);
    }

    @PostMapping
    public Cliente guardarCliente(@RequestBody Cliente cliente) {
        return clienteService.guardarCliente(cliente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminarCliente(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            clienteService.eliminarCliente(id);
            response.put("message", "Cliente eliminado exitosamente");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            response.put("error", "Error al eliminar el cliente: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/nuevoCliente")
    public ResponseEntity<Map<String, Object>> insertarCliente(@RequestBody Cliente cliente) {
        Map<String, Object> response = new HashMap<>();
        try {
            Cliente savedCliente = clienteService.guardarCliente(cliente);
            response.put("message", "Cliente creado exitosamente");
            response.put("cliente", savedCliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "Error al crear el cliente: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
