package org.example.backend.records.ProdutoPorPedidoDTO;

import java.math.BigDecimal;

public record CreateProdutoPorPedidoDTO(
        Long produtoId,
        Integer quantidade,
        BigDecimal precoUnitario,
        Long customBurgerId
) {
} 