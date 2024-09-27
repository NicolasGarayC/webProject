package com.project.controller;

import com.project.model.EstadosDTO;
import com.project.model.ReversionVentaDTO;
import com.project.model.VentaArticuloDTO;
import com.project.model.articulosEstadoDTO;
import com.project.service.ErrorLoggingService;
import com.project.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @Autowired
    private ErrorLoggingService errorLoggingService;

    @PostMapping("/nuevaVenta")
    public ResponseEntity<Map<String, String>> createVenta(@Valid @RequestBody VentaArticuloDTO ventaArticuloDTO) {
        Map<String, String> response = new HashMap<>();
        try {
            ventaService.createVenta(ventaArticuloDTO);
            response.put("message", "Venta registrada exitosamente");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            errorLoggingService.logError("Error en VentaController - createVenta", e, ventaArticuloDTO.toString());
            response.put("error", "Error al crear la venta: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/devolucionVenta")
    public ResponseEntity<Map<String, String>> revertirVenta(@Valid @RequestBody ReversionVentaDTO reversionVentaDTO) {
        Map<String, String> response = new HashMap<>();
        try {
            boolean exito = ventaService.revertirVenta(reversionVentaDTO);
            if (exito) {
                String mensaje = String.format("Articulos devueltos exitosamente. ID de la Venta: %d, Fecha y hora de la reversión: %s",
                        reversionVentaDTO.getIdVenta(), LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                response.put("message", mensaje);
                return ResponseEntity.ok().body(response);
            } else {
                response.put("error", "La reversión de la venta no pudo completarse.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            errorLoggingService.logError("Error en VentaController - devolucionVenta", e, reversionVentaDTO.toString());
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/estadoVenta")
    public ResponseEntity<Map<String, String>> actualizarEstadoVenta(@RequestBody EstadosDTO estadosDTO) {
        Map<String, String> response = new HashMap<>();
        try {
            int idVenta = estadosDTO.getOperacion();
            for (articulosEstadoDTO estado : estadosDTO.getArticulos()) {
                ventaService.actualizarEstadoVenta(idVenta, estado);
            }
            response.put("message", "Se cambió el estado");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            errorLoggingService.logError("Error en VentaController - actualizarEstadoCompra", e, "");
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
