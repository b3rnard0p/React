package org.example.backend.controller;

import java.util.List;

import org.example.backend.records.ComboDTO.GetComboDTO;
import org.example.backend.records.CustomBurgerDTO.CreateCustomBurgerDTO;
import org.example.backend.records.CustomBurgerDTO.GetCustomBurgerDTO;
import org.example.backend.records.IngredienteDTO.GetIngredienteDTO;
import org.example.backend.records.PedidoDTO.CreatePedidoDTO;
import org.example.backend.records.PedidoDTO.GetPedidoDTO;
import org.example.backend.records.ProdutoDTO.GetProdutoDTO;
import org.example.backend.records.UsuarioDTO.CreateUsuarioDTO;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {
    @Autowired
    private ComboService comboService;

    @Autowired
    private IngredienteService ingredienteService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private CustomBurgerService customBurgerService;

    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/combos/ativo")
    public ResponseEntity<GetComboDTO> buscarComboAtivo() {
        return comboService.buscarComboAtivo()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/combos/ativos")
    public ResponseEntity<List<GetComboDTO>> listarCombosAtivos() {
        List<GetComboDTO> combosAtivos = comboService.listarCombosAtivos();
        return ResponseEntity.ok(combosAtivos);
    }

    @GetMapping("/ingredientes")
    public List<GetIngredienteDTO> listarIngredientesAtivos() {
        return ingredienteService.listarTodosNaoDeletados().stream().filter(GetIngredienteDTO::ativo).toList();
    }

    @PostMapping("/custom-burgers")
    public ResponseEntity<GetCustomBurgerDTO> criarCustomBurger(@RequestBody CreateCustomBurgerDTO dto) {
        return customBurgerService.criarCustomBurger(dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/pedidos")
    public ResponseEntity<GetPedidoDTO> criarPedido(@RequestBody CreatePedidoDTO dto) {
        return ResponseEntity.ok(pedidoService.criarPedido(dto));
    }

    @GetMapping("/pedidos/{id}")
    public ResponseEntity<GetPedidoDTO> buscarPedidoPorId(@PathVariable Long id) {
        return pedidoService.buscarPedidoPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/usuarios")
    public ResponseEntity<GetUsuarioDTO> criarUsuario(@RequestBody CreateUsuarioDTO dto) {
        GetUsuarioDTO usuario = usuarioService.criarUsuario(dto);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<GetUsuarioDTO> buscarUsuarioPorId(@PathVariable Long id) {
        GetUsuarioDTO usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/usuarios/email/{email}")
    public ResponseEntity<GetUsuarioDTO> buscarUsuarioPorEmail(@PathVariable String email) {
        GetUsuarioDTO usuario = usuarioService.buscarPorEmail(email);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<GetUsuarioDTO> atualizarUsuario(@PathVariable Long id, @RequestBody UpdateUsuarioDTO dto) {
        GetUsuarioDTO usuario = usuarioService.atualizarUsuario(id, dto);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/usuarios/token")
    public ResponseEntity<GetUsuarioDTO> buscarUsuarioPorToken(HttpServletRequest request) {
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("user_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (token == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            GetUsuarioDTO usuario = usuarioService.buscarPorToken(token);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/produtos")
    public ResponseEntity<List<GetProdutoDTO>> listarProdutosCliente() {
        return ResponseEntity.ok(produtoService.listarTodosProdutosNaoDeletados());
    }

    @GetMapping("/pedidos")
    public ResponseEntity<List<GetPedidoDTO>> listarPedidosPorUsuario(@RequestParam Long usuarioId) {
        List<GetPedidoDTO> pedidos = pedidoService.listarPedidosPorUsuario(usuarioId);
        return ResponseEntity.ok(pedidos);
    }
} 