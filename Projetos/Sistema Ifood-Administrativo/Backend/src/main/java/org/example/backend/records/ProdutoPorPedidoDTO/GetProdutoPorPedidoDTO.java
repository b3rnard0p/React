package org.example.backend.records.ProdutoPorPedidoDTO;

import java.math.BigDecimal;
import java.util.List;

public record GetProdutoPorPedidoDTO(
        Long id,
        Long pedidoId,
        Long produtoId,
        String produtoNome,
        BigDecimal precoUnitario,
        Integer quantidade,
        Long customBurgerId,
        String customBurgerNome,
        List<String> customBurgerIngredientes
) {
}
