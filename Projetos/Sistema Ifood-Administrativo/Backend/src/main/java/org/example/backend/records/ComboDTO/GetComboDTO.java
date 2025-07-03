package org.example.backend.records.ComboDTO;

import java.math.BigDecimal;

import org.example.backend.records.ProdutoDTO.GetProdutoDTO;

public record GetComboDTO(
    Long id,
    String nome,
    String descricao,
    GetProdutoDTO produtoHamburguer,
    GetProdutoDTO produtoBebida,
    GetProdutoDTO produtoSobremesa,
    BigDecimal precoCombo,
    boolean ativo,
    Boolean deleted
) {} 