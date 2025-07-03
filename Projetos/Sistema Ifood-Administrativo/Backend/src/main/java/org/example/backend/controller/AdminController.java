package org.example.backend.controller;

import java.util.List;

import org.example.backend.records.ComboDTO.CreateComboDTO;
import org.example.backend.records.ComboDTO.GetComboDTO;
import org.example.backend.records.ComboDTO.UpdateComboDTO;
import org.example.backend.records.CustomBurgerDTO.GetCustomBurgerDTO;
import org.example.backend.records.IngredienteDTO.CreateIngredienteDTO;
import org.example.backend.records.IngredienteDTO.GetIngredienteDTO;
import org.example.backend.records.IngredienteDTO.UpdateIngredienteDTO;
import org.example.backend.records.PedidoDTO.GetPedidoDTO;
import org.example.backend.records.PedidoDTO.UpdatePedidoDTO;
import org.example.backend.records.ProdutoDTO.GetProdutoDTO;
import org.example.backend.records.ProdutoDTO.UpdateProdutoDTO;
import org.example.backend.records.UsuarioDTO.GetUsuarioDTO;
import org.example.backend.records.UsuarioDTO.UpdateUsuarioDTO;
import org.example.backend.service.ComboService;
import org.example.backend.service.CustomBurgerService;
import org.example.backend.service.IngredienteService;
import org.example.backend.service.PedidoService;
import org.example.backend.service.ProdutoService;
import org.example.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private ComboService comboService;

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private IngredienteService ingredienteService;

    @Autowired
    private CustomBurgerService customBurgerService;

    @GetMapping("/combos")
    public ResponseEntity<List<GetComboDTO>> listarTodosCombos() {
        return ResponseEntity.ok(comboService.listarTodosNaoDeletados());
    }

    @GetMapping("/combos/ativos")
    public ResponseEntity<List<GetComboDTO>> listarCombosAtivos() {
        List<GetComboDTO> combosAtivos = comboService.listarCombosAtivos();
        return ResponseEntity.ok(combosAtivos);
    }

    @GetMapping("/combos/{id}")
    public ResponseEntity<GetComboDTO> buscarComboPorId(@PathVariable Long id) {
        return comboService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/combos")
    public ResponseEntity<GetComboDTO> criarCombo(@RequestBody CreateComboDTO dto) {
        GetComboDTO novoCombo = comboService.criarCombo(dto);
        return ResponseEntity.ok(novoCombo);
    }

    @PutMapping("/combos/{id}")
    public ResponseEntity<GetComboDTO> atualizarComboAdmin(@PathVariable Long id, @RequestBody UpdateComboDTO dto) {
        return comboService.atualizarCombo(id, dto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/combos/{id}")
    public ResponseEntity<Void> removerCombo(@PathVariable Long id) {
        comboService.softDeleteCombo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ingredientes")
    public List<GetIngredienteDTO> listarTodosIngredientes() {
        return ingredienteService.listarTodosNaoDeletados();
    }

    @GetMapping("/ingredientes/{id}")
    public ResponseEntity<GetIngredienteDTO> buscarIngredientePorId(@PathVariable Long id) {
        return ingredienteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/ingredientes")
    public ResponseEntity<GetIngredienteDTO> criarIngrediente(@RequestBody CreateIngredienteDTO dto) {
        GetIngredienteDTO novoIngrediente = ingredienteService.criarIngrediente(dto);
        return ResponseEntity.ok(novoIngrediente);
    }

    @PutMapping("/ingredientes/{id}")
    public ResponseEntity<GetIngredienteDTO> atualizarIngrediente(@PathVariable Long id, @RequestBody UpdateIngredienteDTO dto) {
        return ingredienteService.atualizarIngrediente(id, dto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/ingredientes/{id}")
    public ResponseEntity<Void> deletarIngrediente(@PathVariable Long id) {
        ingredienteService.softDeleteIngrediente(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/custom-burgers")
    public List<GetCustomBurgerDTO> listarTodosCustomBurgers() {
        return customBurgerService.listarTodos();
    }

    // Rotas administrativas de pedidos
    @GetMapping("/pedidos")
    public ResponseEntity<List<GetPedidoDTO>> listarPedidos() {
        return ResponseEntity.ok(pedidoService.listarTodosPedidos());
    }

    @GetMapping("/pedidos/{id}")
    public ResponseEntity<GetPedidoDTO> buscarPedidoPorId(@PathVariable Long id) {
        return pedidoService.buscarPedidoPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/pedidos/{id}/status")
    public ResponseEntity<GetPedidoDTO> atualizarStatusPedido(
            @PathVariable Long id,
            @RequestBody UpdatePedidoDTO dto) {
        try {
            GetPedidoDTO pedidoAtualizado = pedidoService.atualizarStatusPedido(id, dto.status());
            return ResponseEntity.ok(pedidoAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<GetUsuarioDTO>> listarTodosUsuarios() {
        List<GetUsuarioDTO> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<GetUsuarioDTO> buscarUsuarioPorId(@PathVariable Long id) {
        GetUsuarioDTO usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<GetUsuarioDTO> atualizarUsuario(@PathVariable Long id, @RequestBody UpdateUsuarioDTO dto) {
        GetUsuarioDTO usuario = usuarioService.atualizarUsuario(id, dto);
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/produtos/{id}")
    public ResponseEntity<GetProdutoDTO> buscarProdutoPorId(@PathVariable Long id) {
        return produtoService.buscarProdutoPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/produtos/{id}")
    public ResponseEntity<GetProdutoDTO> atualizarProduto(@PathVariable Long id, @RequestBody UpdateProdutoDTO dto) {
        return produtoService.atualizarProduto(id, dto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/produtos/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.softDeleteProduto(id);
        return ResponseEntity.noContent().build();
    }
} 