package com.project.controller;

import com.project.model.CompraArticulosDTO;
import com.project.model.DevoUpdateDTO;
import com.project.model.EstadosDTO;
import com.project.model.articulosEstadoDTO;
import com.project.service.CompraService;
import com.project.service.ErrorLoggingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private ErrorLoggingService errorLoggingService;
    @Autowired
    private CompraService compraService;

    @PostMapping("/registrarCompra")
    public ResponseEntity<Map<String, String>> agregarCompra(@Valid @RequestBody CompraArticulosDTO compraArticulosDTO) {
        try {
            compraService.guardarCompraYRelaciones(compraArticulosDTO);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Compra y artículo agregados exitosamente");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            errorLoggingService.logError("Error en CompraController - registrarCompra", e, compraArticulosDTO.toString());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/devolucionCompra")
    public ResponseEntity<Map<String, String>> actualizarDevolucion(@Valid @RequestBody DevoUpdateDTO devoUpdateDTO) {
        Map<String, String> response = new HashMap<>();
        try {
            compraService.actualizarDevolucion(devoUpdateDTO.getIdCompra(), devoUpdateDTO.getDescripcion(), devoUpdateDTO.getDevuelto());
            response.put("message", "Devolución exitosa");
            return ResponseEntity.ok().body(response);
        } catch (RuntimeException e) {
            errorLoggingService.logError("Error en CompraController - devolucionCompra", e, devoUpdateDTO.toString());
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/estadoCompra")
    public ResponseEntity<Map<String, String>> actualizarEstadoCompra(@RequestBody EstadosDTO estadosDTO) {
        Map<String, String> response = new HashMap<>();
        try {
            int idCompra = estadosDTO.getOperacion();
            for (articulosEstadoDTO estado : estadosDTO.getArticulos()) {
                compraService.actualizarEstadoCompra(idCompra, estado);
            }
            response.put("message", "Se cambió el estado");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            errorLoggingService.logError("Error en CompraController - actualizarEstadoCompra", e, "");
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}