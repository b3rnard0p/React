package org.example.backend.records.PedidoDTO;

import java.math.BigDecimal;
import java.util.List;

import org.example.backend.model.FormaPagamento;
import org.example.backend.records.ProdutoPorPedidoDTO.CreateProdutoPorPedidoDTO;

public record CreatePedidoDTO(
        List<CreateProdutoPorPedidoDTO> produtos,
        BigDecimal total,
        Long usuarioId,
        FormaPagamento formaPagamento
) {}
