package org.example.backend.records.UsuarioDTO;

public record GetUsuarioDTO(
    Long id,
    String nome,
    String email,
    String telefone,
    String rua,
    String numero,
    String complemento,
    String cidade,
    String estado,
    String cep,
    String token
) {} 