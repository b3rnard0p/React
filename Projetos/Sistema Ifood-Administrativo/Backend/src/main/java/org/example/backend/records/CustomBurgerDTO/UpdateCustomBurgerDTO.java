package org.example.backend.records.CustomBurgerDTO;

import java.util.List;

public record UpdateCustomBurgerDTO(
    Long usuarioId,
    List<Long> ingredientesIds
) {} 