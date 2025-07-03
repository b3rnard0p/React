package org.example.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.backend.model.Combo;
import org.example.backend.model.Produto;
import org.example.backend.records.ComboDTO.CreateComboDTO;
import org.example.backend.records.ComboDTO.GetComboDTO;
import org.example.backend.records.ComboDTO.UpdateComboDTO;
import org.example.backend.records.ProdutoDTO.GetProdutoDTO;
import org.example.backend.repository.ComboRepository;
import org.example.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComboService {
    @Autowired
    private ComboRepository comboRepository;
    @Autowired
    private ProdutoRepository produtoRepository;

    public List<GetComboDTO> listarTodos() {
        return comboRepository.findAll().stream().map(this::toGetComboDTO).collect(Collectors.toList());
    }

    public Optional<GetComboDTO> buscarComboAtivo() {
        return comboRepository.findByAtivoTrue().map(this::toGetComboDTO);
    }

    public GetComboDTO criarCombo(CreateComboDTO dto) {
        Combo combo = new Combo();
        combo.setNome(dto.nome());
        combo.setDescricao(dto.descricao());
        combo.setProdutoHamburguer(produtoRepository.findById(dto.produtoHamburguerId()).orElse(null));
        combo.setProdutoBebida(produtoRepository.findById(dto.produtoBebidaId()).orElse(null));
        combo.setProdutoSobremesa(produtoRepository.findById(dto.produtoSobremesaId()).orElse(null));
        combo.setPrecoCombo(dto.precoCombo());
        combo.setAtivo(dto.ativo());
        combo.setDeleted(false);
        return toGetComboDTO(comboRepository.save(combo));
    }

    public Optional<GetComboDTO> atualizarCombo(Long id, UpdateComboDTO dto) {
        return comboRepository.findById(id).map(combo -> {
            combo.setNome(dto.nome());
            combo.setDescricao(dto.descricao());
            combo.setProdutoHamburguer(produtoRepository.findById(dto.produtoHamburguerId()).orElse(null));
            combo.setProdutoBebida(produtoRepository.findById(dto.produtoBebidaId()).orElse(null));
            combo.setProdutoSobremesa(produtoRepository.findById(dto.produtoSobremesaId()).orElse(null));
            combo.setPrecoCombo(dto.precoCombo());
            combo.setAtivo(dto.ativo());
            return toGetComboDTO(comboRepository.save(combo));
        });
    }

    public void removerCombo(Long id) {
        comboRepository.deleteById(id);
    }

    public Optional<GetComboDTO> buscarPorId(Long id) {
        return comboRepository.findById(id).map(this::toGetComboDTO);
    }

    public List<GetComboDTO> listarTodosNaoDeletados() {
        return comboRepository.findAllByDeletedFalse().stream().map(this::toGetComboDTO).collect(Collectors.toList());
    }

    public void softDeleteCombo(Long id) {
        comboRepository.findById(id).ifPresent(combo -> {
            combo.setDeleted(true);
            comboRepository.save(combo);
        });
    }

    public List<GetComboDTO> listarCombosAtivos() {
        return comboRepository.findAllByAtivoTrueAndDeletedFalse().stream().map(this::toGetComboDTO).collect(Collectors.toList());
    }

    private GetComboDTO toGetComboDTO(Combo combo) {
        return new GetComboDTO(
            combo.getId(),
            combo.getNome(),
            combo.getDescricao(),
            toGetProdutoDTO(combo.getProdutoHamburguer()),
            toGetProdutoDTO(combo.getProdutoBebida()),
            toGetProdutoDTO(combo.getProdutoSobremesa()),
            combo.getPrecoCombo(),
            combo.isAtivo(),
            combo.getDeleted()
        );
    }

    private GetProdutoDTO toGetProdutoDTO(Produto produto) {
        if (produto == null) return null;
        return new GetProdutoDTO(
            produto.getId(),
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getCategoria(),
            produto.getDisponibilidade(),
            produto.getImagem()
        );
    }
} 