package org.example.backend.repository;

import java.util.List;

import org.example.backend.model.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
    List<Ingrediente> findAllByDeletedFalse();
} 