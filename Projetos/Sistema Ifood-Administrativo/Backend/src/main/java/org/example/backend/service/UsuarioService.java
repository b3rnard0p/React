package org.example.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.example.backend.model.Usuario;
import org.example.backend.records.UsuarioDTO.CreateUsuarioDTO;
import org.example.backend.records.UsuarioDTO.GetUsuarioDTO;
import org.example.backend.records.UsuarioDTO.UpdateUsuarioDTO;
import org.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public GetUsuarioDTO criarUsuario(CreateUsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setTelefone(dto.telefone());
        usuario.setRua(dto.rua());
        usuario.setNumero(dto.numero());
        usuario.setComplemento(dto.complemento());
        usuario.setCidade(dto.cidade());
        usuario.setEstado(dto.estado());
        usuario.setCep(dto.cep());
        usuario.setToken(UUID.randomUUID().toString());

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return converterParaDTO(savedUsuario);
    }

    public GetUsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return converterParaDTO(usuario);
    }

    public GetUsuarioDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        return converterParaDTO(usuario);
    }

    public GetUsuarioDTO buscarPorToken(String token) {
        Usuario usuario = usuarioRepository.findByToken(token);
        if (usuario == null) {
            throw new RuntimeException("Usuário não encontrado para o token informado");
        }
        return converterParaDTO(usuario);
    }

    public List<GetUsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public GetUsuarioDTO atualizarUsuario(Long id, UpdateUsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setTelefone(dto.telefone());
        usuario.setRua(dto.rua());
        usuario.setNumero(dto.numero());
        usuario.setComplemento(dto.complemento());
        usuario.setCidade(dto.cidade());
        usuario.setEstado(dto.estado());
        usuario.setCep(dto.cep());

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return converterParaDTO(savedUsuario);
    }

    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    private GetUsuarioDTO converterParaDTO(Usuario usuario) {
        return new GetUsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getRua(),
                usuario.getNumero(),
                usuario.getComplemento(),
                usuario.getCidade(),
                usuario.getEstado(),
                usuario.getCep(),
                usuario.getToken()
        );
    }
} 