package org.example.backend.records.ComboDTO;

import java.math.BigDecimal;

public record UpdateComboDTO(
    String nome,
    String descricao,
    Long produtoHamburguerId,
    Long produtoBebidaId,
    Long produtoSobremesaId,
    BigDecimal precoCombo,
    boolean ativo
) {} 