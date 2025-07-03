package org.example.backend.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
public class Combo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_hamburguer_id")
    private Produto produtoHamburguer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_bebida_id")
    private Produto produtoBebida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_sobremesa_id")
    private Produto produtoSobremesa;

    private BigDecimal precoCombo;
    private boolean ativo;
    private Boolean deleted = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Produto getProdutoHamburguer() { return produtoHamburguer; }
    public void setProdutoHamburguer(Produto produtoHamburguer) { this.produtoHamburguer = produtoHamburguer; }

    public Produto getProdutoBebida() { return produtoBebida; }
    public void setProdutoBebida(Produto produtoBebida) { this.produtoBebida = produtoBebida; }

    public Produto getProdutoSobremesa() { return produtoSobremesa; }
    public void setProdutoSobremesa(Produto produtoSobremesa) { this.produtoSobremesa = produtoSobremesa; }

    public BigDecimal getPrecoCombo() { return precoCombo; }
    public void setPrecoCombo(BigDecimal precoCombo) { this.precoCombo = precoCombo; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
} 