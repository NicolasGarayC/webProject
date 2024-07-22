package com.project.repository;
import com.project.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

}
