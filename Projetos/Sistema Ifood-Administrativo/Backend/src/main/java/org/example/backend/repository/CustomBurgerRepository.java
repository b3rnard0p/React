package org.example.backend.repository;

import org.example.backend.model.CustomBurger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomBurgerRepository extends JpaRepository<CustomBurger, Long> {
} 