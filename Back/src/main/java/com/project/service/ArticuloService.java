package com.project.service;

import com.project.model.*;
import com.project.repository.ArticuloRepository;
import com.project.repository.CompraRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticuloService {
    @Autowired
    private ArticuloRepository articuloRepository;
    @Autowired
    private CompraRepository compraRepository;

    public Articulo actualizarArticulo(ArticuloUpdateDTO articuloUpdateDTO) {
        Optional<Articulo> articuloOptional = articuloRepository.findById(articuloUpdateDTO.getId());

        if (articuloOptional.isPresent()) {
            Articulo articulo = articuloOptional.get();
            articulo.setNombrearticulo(articuloUpdateDTO.getNombrearticulo());
            articulo.setMarca(articuloUpdateDTO.getMarca());
            articulo.setModelo(articuloUpdateDTO.getModelo());
            articulo.setColor(articuloUpdateDTO.getColor());
            articulo.setUnidaddemedida(articuloUpdateDTO.getUnidaddemedida());
            articulo.setUnidadesdisponibles(articuloUpdateDTO.getUnidadesdisponibles());
            articulo.setValorunitario(articuloUpdateDTO.getValorunitario());
            articuloRepository.save(articulo);
            return articulo;
        } else {
            throw new RuntimeException("No se encontró el artículo con ID " + articuloUpdateDTO.getId());
        }
    }
    public void eliminarArticuloPorId(int id) {
        if (articuloRepository.existsById(id)) {
            articuloRepository.deleteById(id);
        } else {
            throw new RuntimeException("No se encontró el artículo con ID " + id);
        }
    }
    public Integer guardarArticulo(ArticulosCompraDTO compraDTO) {
            Articulo articulo = compraDTO.getArticulo();
        Optional<Articulo> articuloExistente = articuloRepository.findByNombrearticuloIgnoreCaseAndMarcaIgnoreCaseAndModeloIgnoreCaseAndColorIgnoreCase(
                articulo.getNombrearticulo(),
                articulo.getMarca(),
                articulo.getModelo(),
                articulo.getColor()
        );

        if (articuloExistente.isPresent()) {
            Articulo existente = articuloExistente.get();
            int totalUnidades = existente.getUnidadesdisponibles() + compraDTO.getUnidadesCompradas();

            double valorPromedioPonderado = ((existente.getValorunitario() * existente.getUnidadesdisponibles())
                    + (compraDTO.getValorUnidad() + (compraDTO.getValorUnidad() * 0.25)) * compraDTO.getUnidadesCompradas())
                    / totalUnidades;

            existente.setValorunitario(valorPromedioPonderado);
            existente.setUnidadesdisponibles(totalUnidades);
            articuloRepository.save(existente);
            return existente.getId();
        } else {
            double nuevoValor = compraDTO.getValorUnidad() + (compraDTO.getValorUnidad() * 0.25);
            articulo.setValorunitario(nuevoValor);
            articulo.setUnidadesdisponibles(compraDTO.getUnidadesCompradas());
            Articulo nuevoArticulo = articuloRepository.save(articulo);
            try {
                compraRepository.insertArticuloCategoria(nuevoArticulo.getId(), compraDTO.getIdCategoria());
            } catch (Exception e) {
                throw new RuntimeException("Error al insertar en bd.articulo_categoria: " + e.getMessage());
            }
            return nuevoArticulo.getId();
        }
    }
    public boolean updateValorUnitario(Integer id, double valorunitario) {
        try{
            Optional<Articulo> articuloOptional = articuloRepository.findById(id);
            if (articuloOptional.isPresent()) {
                Articulo articulo = articuloOptional.get();
                articulo.setValorunitario(valorunitario);
                try{
                    articuloRepository.save(articulo);
                    return true;
                }catch(Exception e){
                    throw new RuntimeException("Error,interno al guardar el articulo ");
                }
            }
            return false;
        }catch (Exception e){
            throw new RuntimeException("Error,el articulo no existe: ");
        }
    }

    @Transactional
    public Articulo findById(int idArticulo) {
        Optional<Articulo> optionalArticulo = articuloRepository.findById(idArticulo);

        if (optionalArticulo.isPresent()) {
            Articulo articulo = optionalArticulo.get();
            return articulo;
        } else {
            throw new RuntimeException("No se encontró el artículo con ID " + idArticulo);
        }
    }

    @Transactional
    public void findByIdAndUpdateUnidadesDisponibles(Integer idArticulo, int nuevasUnidades) {
        Optional<Articulo> optionalArticulo = articuloRepository.findById(idArticulo);

        if (optionalArticulo.isPresent()) {
            Articulo articulo = optionalArticulo.get();
            articulo.setUnidadesdisponibles(nuevasUnidades);
            articuloRepository.save(articulo);
        } else {
            throw new RuntimeException("No se encontró el artículo con ID " + idArticulo);
        }
    }
    public List<Articulo> getAllArticulos() {
        return articuloRepository.findAll();
    }

}
