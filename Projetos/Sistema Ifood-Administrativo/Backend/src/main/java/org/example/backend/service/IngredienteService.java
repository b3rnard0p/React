package org.example.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.backend.model.Ingrediente;
import org.example.backend.records.IngredienteDTO.CreateIngredienteDTO;
import org.example.backend.records.IngredienteDTO.GetIngredienteDTO;
import org.example.backend.records.IngredienteDTO.UpdateIngredienteDTO;
import org.example.backend.repository.IngredienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IngredienteService {
    @Autowired
    private IngredienteRepository ingredienteRepository;

    public List<GetIngredienteDTO> listarTodos() {
        return ingredienteRepository.findAll().stream().map(this::toGetIngredienteDTO).collect(Collectors.toList());
    }

    public Optional<GetIngredienteDTO> buscarPorId(Long id) {
        return ingredienteRepository.findById(id).map(this::toGetIngredienteDTO);
    }

    public GetIngredienteDTO criarIngrediente(CreateIngredienteDTO dto) {
        Ingrediente ingrediente = new Ingrediente();
        ingrediente.setNome(dto.nome());
        ingrediente.setTipo(dto.tipo());
        ingrediente.setPreco(dto.preco());
        ingrediente.setEstoque(dto.estoque());
        ingrediente.setAtivo(dto.ativo());
        ingrediente.setDeleted(false);
        return toGetIngredienteDTO(ingredienteRepository.save(ingrediente));
    }

    public Optional<GetIngredienteDTO> atualizarIngrediente(Long id, UpdateIngredienteDTO dto) {
        return ingredienteRepository.findById(id).map(ingrediente -> {
            ingrediente.setNome(dto.nome());
            ingrediente.setTipo(dto.tipo());
            ingrediente.setPreco(dto.preco());
            ingrediente.setEstoque(dto.estoque());
            ingrediente.setAtivo(dto.ativo());
            return toGetIngredienteDTO(ingredienteRepository.save(ingrediente));
        });
    }

    public void removerIngrediente(Long id) {
        ingredienteRepository.deleteById(id);
    }

    public List<GetIngredienteDTO> listarTodosNaoDeletados() {
        return ingredienteRepository.findAllByDeletedFalse().stream().map(this::toGetIngredienteDTO).collect(Collectors.toList());
    }

    public void softDeleteIngrediente(Long id) {
        ingredienteRepository.findById(id).ifPresent(ingrediente -> {
            ingrediente.setDeleted(true);
            ingredienteRepository.save(ingrediente);
        });
    }

    public boolean reduzirEstoque(List<Long> ingredientesIds) {
        List<Ingrediente> ingredientes = ingredienteRepository.findAllById(ingredientesIds);
        for (Ingrediente ing : ingredientes) {
            if (ing.getEstoque() == null || ing.getEstoque() <= 0) {
                return false;
            }
        }
        for (Ingrediente ing : ingredientes) {
            ing.setEstoque(ing.getEstoque() - 1);
            ingredienteRepository.save(ing);
        }
        return true;
    }

    private GetIngredienteDTO toGetIngredienteDTO(Ingrediente ingrediente) {
        return new GetIngredienteDTO(
            ingrediente.getId(),
            ingrediente.getNome(),
            ingrediente.getTipo(),
            ingrediente.getPreco(),
            ingrediente.getEstoque(),
            ingrediente.getAtivo(),
            ingrediente.getDeleted()
        );
    }
} 