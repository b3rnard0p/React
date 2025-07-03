package org.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.example.backend.model.Combo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComboRepository extends JpaRepository<Combo, Long> {
    Optional<Combo> findByAtivoTrue();
    List<Combo> findAllByDeletedFalse();
    List<Combo> findAllByAtivoTrueAndDeletedFalse();
} 