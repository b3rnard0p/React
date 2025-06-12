package org.example.backend.controller;

import org.example.backend.model.Pedido;
import org.example.backend.model.Produto;
import org.example.backend.model.ProdutoPorPedido;
import org.example.backend.repository.PedidoRepository;
import org.example.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin("*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    /**
     * DTO para representar itens do pedido na requisição.
     */
    public static class ItemRequest {
        public Long produtoId;
        public Integer quantidade;
    }

    /**
     * DTO para criar um pedido.
     */
    public static class PedidoRequest {
        public List<ItemRequest> itens;
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        // Se quiser vir ordenado por data, pode usar findAll(Sort.by("data").descending())
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Pedido> criarPedido(@RequestBody PedidoRequest pedidoRequest) {
        // Cria entidade Pedido
        Pedido pedido = new Pedido();
        pedido.setData(new Date());
        List<ProdutoPorPedido> listaItens = new ArrayList<>();

        // Para cada item da requisição, busca produto e monta relacionamento
        for (ItemRequest item : pedidoRequest.itens) {
            Optional<Produto> produtoOpt = produtoRepository.findById(item.produtoId);
            if (produtoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null);
            }
            Produto produto = produtoOpt.get();

            ProdutoPorPedido ppp = new ProdutoPorPedido();
            ppp.setPedido(pedido);
            ppp.setProduto(produto);

            listaItens.add(ppp);
        }

        pedido.setProdutos(listaItens);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pedidoSalvo);
    }
}
