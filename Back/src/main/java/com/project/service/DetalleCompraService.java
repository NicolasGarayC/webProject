package com.project.service;
import java.util.ArrayList;
import java.util.List;

import com.project.model.Articulo;
import com.project.model.ArticulosCompraDTO;
import com.project.model.Compra;
import com.project.model.DetalleCompra;
import com.project.repository.ArticuloRepository;
import com.project.repository.CompraRepository;
import com.project.repository.DetalleCompraRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
@Service
public class DetalleCompraService {

    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    @Autowired
    private ArticuloRepository articuloRepository;

    public List<DetalleCompra> getDetallesCompraByIdcompra(int idcompra) {
        return detalleCompraRepository.findByIdcompra(idcompra);
    }

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public DetalleCompra guardarDetalleCompra(ArticulosCompraDTO compraArticulosDTO,Compra savedCompra, int idArticulo) {
        try {
            DetalleCompra detalleCompra = new DetalleCompra();
            detalleCompra.setIdcompra(savedCompra.getId());
            detalleCompra.setIdcategoria(compraArticulosDTO.getIdCategoria());
            detalleCompra.setValorunidad(compraArticulosDTO.getValorUnidad());
            detalleCompra.setUnidadescompradas(compraArticulosDTO.getUnidadesCompradas());
            detalleCompra.setEstado(compraArticulosDTO.getEstado());
            detalleCompra.setIdarticulo(idArticulo);
            return detalleCompraRepository.save(detalleCompra);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar compra y relaciones: " + e.getMessage(), e);
        }
    }
}