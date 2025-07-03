package org.example.backend.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.example.backend.model.CustomBurger;
import org.example.backend.model.Pedido;
import org.example.backend.model.Produto;
import org.example.backend.model.ProdutoPorPedido;
import org.example.backend.model.StatusPedido;
import org.example.backend.model.Usuario;
import org.example.backend.records.PedidoDTO.CreatePedidoDTO;
import org.example.backend.records.PedidoDTO.GetPedidoDTO;
import org.example.backend.records.ProdutoPorPedidoDTO.CreateProdutoPorPedidoDTO;
import org.example.backend.records.ProdutoPorPedidoDTO.GetProdutoPorPedidoDTO;
import org.example.backend.repository.CustomBurgerRepository;
import org.example.backend.repository.PedidoRepository;
import org.example.backend.repository.ProdutoRepository;
import org.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CustomBurgerRepository customBurgerRepository;

    public List<GetPedidoDTO> listarTodosPedidos() {
        return pedidoRepository.findAll().stream().map(this::toGetPedidoDTO).toList();
    }

    @Transactional
    public GetPedidoDTO criarPedido(CreatePedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setData(new Date());
        pedido.setTotal(dto.total());
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setFormaPagamento(dto.formaPagamento());

        // Buscar o usuário
        if (dto.usuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + dto.usuarioId()));
            pedido.setUsuario(usuario);
        }

        List<ProdutoPorPedido> listaItens = new ArrayList<>();

        for (CreateProdutoPorPedidoDTO item : dto.produtos()) {
            ProdutoPorPedido ppp = new ProdutoPorPedido();
            ppp.setPedido(pedido);
            if (item.customBurgerId() != null) {
                CustomBurger customBurger = customBurgerRepository.findById(item.customBurgerId())
                    .orElseThrow(() -> new IllegalArgumentException("CustomBurger não encontrado com ID: " + item.customBurgerId()));
                ppp.setCustomBurger(customBurger);
                ppp.setProduto(null);
                ppp.setPrecoUnitario(item.precoUnitario());
                ppp.setQuantidade(item.quantidade());
            } else {
                Produto produto = produtoRepository.findById(item.produtoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com ID: " + item.produtoId()));
                ppp.setProduto(produto);
                ppp.setCustomBurger(null);
                ppp.setPrecoUnitario(item.precoUnitario());
                ppp.setQuantidade(item.quantidade());
            }
            listaItens.add(ppp);
        }

        pedido.setProdutos(listaItens);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        return toGetPedidoDTO(pedidoSalvo);
    }

    public GetPedidoDTO toGetPedidoDTO(Pedido pedido) {
        @SuppressWarnings("unchecked")
        List<GetProdutoPorPedidoDTO> produtosDTO = (List<GetProdutoPorPedidoDTO>) (List<?>) pedido.getProdutos().stream()
                .map(ppp -> {
                    String customBurgerNome = null;
                    List<String> customBurgerIngredientes = null;
                    
                    if (ppp.getCustomBurger() != null) {
                        customBurgerNome = "Hambúrguer Personalizado";
                        customBurgerIngredientes = ppp.getCustomBurger().getIngredientes().stream()
                                .map(ingrediente -> ingrediente.getNome())
                                .collect(java.util.stream.Collectors.toList());
                    }
                    
                    return new GetProdutoPorPedidoDTO(
                            ppp.getId(),
                            ppp.getPedido().getId(),
                            ppp.getProduto() != null ? ppp.getProduto().getId() : null,
                            ppp.getProduto() != null ? ppp.getProduto().getNome() : customBurgerNome,
                            ppp.getPrecoUnitario(),
                            ppp.getQuantidade(),
                            ppp.getCustomBurger() != null ? ppp.getCustomBurger().getId() : null,
                            customBurgerNome,
                            customBurgerIngredientes
                    );
                })
                .collect(java.util.stream.Collectors.toList());

        // Informações do cliente
        String nomeCliente = pedido.getUsuario() != null ? pedido.getUsuario().getNome() : "Cliente não identificado";
        String telefoneCliente = pedido.getUsuario() != null ? pedido.getUsuario().getTelefone() : "";
        String enderecoCliente = pedido.getUsuario() != null ?
                pedido.getUsuario().getRua() + ", " +
                        pedido.getUsuario().getNumero() +
                        (pedido.getUsuario().getComplemento() != null && !pedido.getUsuario().getComplemento().isEmpty() ? " - " + pedido.getUsuario().getComplemento() : "") +
                        ", " + pedido.getUsuario().getCidade() +
                        " - " + pedido.getUsuario().getEstado()
                : "";

        return new GetPedidoDTO(
                pedido.getId(),
                produtosDTO,
                pedido.getData(),
                pedido.getTotal(),
                pedido.getStatus(),
                nomeCliente,
                telefoneCliente,
                enderecoCliente,
                pedido.getFormaPagamento()
        );
    }

    public Optional<GetPedidoDTO> buscarPedidoPorId(Long id) {
        return pedidoRepository.findById(id)
                .map(this::toGetPedidoDTO);
    }

    @Transactional
    public GetPedidoDTO atualizarStatusPedido(Long id, StatusPedido status) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado com ID: " + id));

        pedido.setStatus(status);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        return toGetPedidoDTO(pedidoSalvo); // Use o método de conversão existente
    }

    public List<GetPedidoDTO> listarPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findAll().stream()
            .filter(p -> p.getUsuario() != null && p.getUsuario().getId().equals(usuarioId))
            .map(this::toGetPedidoDTO)
            .toList();
    }
}