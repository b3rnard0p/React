package org.example.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.backend.model.CustomBurger;
import org.example.backend.model.Ingrediente;
import org.example.backend.model.Usuario;
import org.example.backend.records.CustomBurgerDTO.CreateCustomBurgerDTO;
import org.example.backend.records.CustomBurgerDTO.GetCustomBurgerDTO;
import org.example.backend.records.IngredienteDTO.GetIngredienteDTO;
import org.example.backend.records.UsuarioDTO.GetUsuarioDTO;
import org.example.backend.repository.CustomBurgerRepository;
import org.example.backend.repository.IngredienteRepository;
import org.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomBurgerService {
    @Autowired
    private CustomBurgerRepository customBurgerRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private IngredienteRepository ingredienteRepository;

    public List<GetCustomBurgerDTO> listarTodos() {
        return customBurgerRepository.findAll().stream().map(this::toGetCustomBurgerDTO).collect(Collectors.toList());
    }

    public Optional<GetCustomBurgerDTO> buscarPorId(Long id) {
        return customBurgerRepository.findById(id).map(this::toGetCustomBurgerDTO);
    }

    public Optional<GetCustomBurgerDTO> criarCustomBurger(CreateCustomBurgerDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(dto.usuarioId());
        if (usuarioOpt.isEmpty()) return Optional.empty();
        List<Ingrediente> ingredientes = ingredienteRepository.findAllById(dto.ingredientesIds());
        if (ingredientes.isEmpty()) return Optional.empty();
        // Reduzir estoque
        for (Long ingId : dto.ingredientesIds()) {
            Ingrediente ing = ingredientes.stream().filter(i -> i.getId().equals(ingId)).findFirst().orElse(null);
            if (ing == null || ing.getEstoque() == null || ing.getEstoque() <= 0) {
                return Optional.empty();
            }
            ing.setEstoque(ing.getEstoque() - 1);
            ingredienteRepository.save(ing);
        }
        BigDecimal preco = ingredientes.stream().map(i -> i.getPreco() != null ? i.getPreco() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        CustomBurger cb = new CustomBurger();
        cb.setUsuario(usuarioOpt.get());
        cb.setIngredientes(ingredientes);
        cb.setPreco(preco);
        cb.setDataCriacao(LocalDateTime.now());
        return Optional.of(toGetCustomBurgerDTO(customBurgerRepository.save(cb)));
    }

    private GetCustomBurgerDTO toGetCustomBurgerDTO(CustomBurger cb) {
        return new GetCustomBurgerDTO(
            cb.getId(),
            new GetUsuarioDTO(cb.getUsuario().getId(), cb.getUsuario().getNome(), cb.getUsuario().getEmail(), cb.getUsuario().getTelefone(), cb.getUsuario().getRua(), cb.getUsuario().getNumero(), cb.getUsuario().getComplemento(), cb.getUsuario().getCidade(), cb.getUsuario().getEstado(), cb.getUsuario().getCep(), cb.getUsuario().getToken()),
            cb.getIngredientes().stream().map(i -> new GetIngredienteDTO(i.getId(), i.getNome(), i.getTipo(), i.getPreco(), i.getEstoque(), i.getAtivo(), i.getDeleted())).collect(Collectors.toList()),
            cb.getPreco(),
            cb.getDataCriacao()
        );
    }
} 