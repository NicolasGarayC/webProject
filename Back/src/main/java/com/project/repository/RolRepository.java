package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.project.model.Rol;

import java.util.List;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
}

