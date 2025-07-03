package org.example.backend.records.PedidoDTO;

import org.example.backend.model.Pedido;
import org.example.backend.model.StatusPedido;

public record UpdatePedidoDTO(
        StatusPedido status
) {}