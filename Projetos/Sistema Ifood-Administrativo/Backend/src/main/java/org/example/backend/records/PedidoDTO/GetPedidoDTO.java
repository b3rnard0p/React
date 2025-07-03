package org.example.backend.records.PedidoDTO;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.example.backend.model.FormaPagamento;
import org.example.backend.model.StatusPedido;
import org.example.backend.records.ProdutoPorPedidoDTO.GetProdutoPorPedidoDTO;

public record GetPedidoDTO(
        Long id,
        List<GetProdutoPorPedidoDTO> produtos,
        Date data,
        BigDecimal total,
        StatusPedido status,
        String nomeCliente,
        String telefoneCliente,
        String enderecoCliente,
        FormaPagamento formaPagamento
) {}
