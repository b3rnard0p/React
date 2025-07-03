package org.example.backend.records.IngredienteDTO;

import java.math.BigDecimal;

public record UpdateIngredienteDTO(
    String nome,
    String tipo,
    BigDecimal preco,
    Integer estoque,
    Boolean ativo
) {} 