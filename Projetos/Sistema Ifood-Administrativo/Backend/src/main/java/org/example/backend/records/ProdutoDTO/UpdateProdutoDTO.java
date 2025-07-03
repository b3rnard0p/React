package org.example.backend.records.ProdutoDTO;

import org.example.backend.model.Categoria;

import java.math.BigDecimal;

public record UpdateProdutoDTO (
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        Categoria categoria,
        boolean disponibilidade,
        String imagem
){
}
