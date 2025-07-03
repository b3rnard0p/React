package org.example.backend.records.IngredienteDTO;

import java.math.BigDecimal;

public record GetIngredienteDTO(
    Long id,
    String nome,
    String tipo,
    BigDecimal preco,
    Integer estoque,
    Boolean ativo,
    Boolean deleted
) {} 