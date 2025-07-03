package org.example.backend.records.CustomBurgerDTO;

import java.util.List;

public record CreateCustomBurgerDTO(
    Long usuarioId,
    List<Long> ingredientesIds
) {} 