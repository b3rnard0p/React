package org.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.example.backend.model.Produto;
import org.example.backend.records.ProdutoDTO.CreateProdutoDTO;
import org.example.backend.records.ProdutoDTO.GetProdutoDTO;
import org.example.backend.records.ProdutoDTO.UpdateProdutoDTO;
import org.example.backend.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<GetProdutoDTO> listarTodosProdutos() {
        return produtoRepository.findAll().stream()
                .map(this::toGetProdutoDTO)
                .toList();
    }

    public Optional<GetProdutoDTO> buscarProdutoPorId(Long id) {
        return produtoRepository.findById(id)
                .map(this::toGetProdutoDTO);
    }

    public GetProdutoDTO adicionarProduto(CreateProdutoDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setPreco(dto.preco());
        produto.setCategoria(dto.categoria());
        produto.setDisponibilidade(dto.disponibilidade());
        produto.setImagem(dto.imagem());

        Produto salvo = produtoRepository.save(produto);
        return toGetProdutoDTO(salvo);
    }

    public Optional<GetProdutoDTO> atualizarProduto(Long id, UpdateProdutoDTO dto) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    produto.setNome(dto.nome());
                    produto.setDescricao(dto.descricao());
                    produto.setPreco(dto.preco());
                    produto.setCategoria(dto.categoria());
                    produto.setDisponibilidade(dto.disponibilidade());
                    produto.setImagem(dto.imagem());
                    return produtoRepository.save(produto);
                })
                .map(this::toGetProdutoDTO);
    }

    public void removerProduto(Long id) {
        produtoRepository.deleteById(id);
    }

    public List<GetProdutoDTO> listarTodosProdutosNaoDeletados() {
        return produtoRepository.findAllByDeletedFalse().stream()
                .map(this::toGetProdutoDTO)
                .toList();
    }

    public void softDeleteProduto(Long id) {
        produtoRepository.findById(id).ifPresent(produto -> {
            produto.setDeleted(true);
            produtoRepository.save(produto);
        });
    }

    private GetProdutoDTO toGetProdutoDTO(Produto produto) {
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