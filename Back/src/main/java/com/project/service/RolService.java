package com.project.service;

import com.project.model.Rol;
import com.project.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public List<Rol> getAllRoles() {
        return rolRepository.findAll();
    }

    public Optional<Rol> getRolById(Long id) {
        return rolRepository.findById(id);
    }

    public Rol createRol(Rol rol) {
        return rolRepository.save(rol);
    }

    public Rol updateRol(Long id, Rol updatedRol) {
        Optional<Rol> existingRol = rolRepository.findById(id);

        if (existingRol.isPresent()) {
            Rol rol = existingRol.get();
            rol.setRol(updatedRol.getRol());
            return rolRepository.save(rol);
        }

        return null;
    }

    public void deleteRol(Long id) {
        rolRepository.deleteById(id);
    }
}
