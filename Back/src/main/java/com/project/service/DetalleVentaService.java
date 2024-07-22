package com.project.service;

import com.project.model.*;
import com.project.repository.ArticuloRepository;
import com.project.repository.DetalleVentaRepository;
import com.project.repository.VentaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleVentaService {

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private ArticuloService articuloService;

    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private VentaRepository ventaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public DetalleVenta guardarDetalleVenta(ArticuloVentaDTO ventaArticulosDTO, Venta savedVenta, int idArticulo) {
        try {
            Long ventaId = (long) savedVenta.getId();
            Optional<ArticuloCategoria> categoriaOpt = articuloRepository.selectCategoria(idArticulo);
            if(!categoriaOpt.isPresent()){
                throw new RuntimeException("El articulo con el id " + idArticulo + " no existe.");
            }
            Integer idCategoria = categoriaOpt.get().getIdcategoria();

            Optional<Venta> ventaOptional = ventaRepository.findById(ventaId);
            if (ventaOptional.isEmpty()) {
                throw new RuntimeException("La venta con el id " + ventaId + " no existe.");
            }
            Articulo articulo = articuloService.findById(idArticulo);

            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setIdventa(ventaId.intValue());
            detalleVenta.setIdcategoria(idCategoria);
            detalleVenta.setUnidadesvendidas(ventaArticulosDTO.getUnidadesVendidas());
            detalleVenta.setIdarticulo(idArticulo);
            detalleVenta.setEstado(ventaArticulosDTO.getEstado());
            if(detalleVenta.getEstado()==1 || detalleVenta.getEstado()==2){
                if (articulo != null) {
                    detalleVenta.setValorunidad(articulo.getValorunitario());
                }
                return detalleVentaRepository.save(detalleVenta);
            }else{
                throw new RuntimeException("El estado no es valido para el registro: "+ detalleVenta.getEstado());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar venta y relaciones: " + e.getMessage(), e);
        }
    }
    public List<DetalleVenta> getDetallesVentaByIdcompra(int idventa) {
        return detalleVentaRepository.findByIdventa(idventa);
    }
}
