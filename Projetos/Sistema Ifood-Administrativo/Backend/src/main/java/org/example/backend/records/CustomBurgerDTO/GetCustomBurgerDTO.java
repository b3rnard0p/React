package org.example.backend.records.CustomBurgerDTO;

import org.example.backend.records.UsuarioDTO.GetUsuarioDTO;
import org.example.backend.records.IngredienteDTO.GetIngredienteDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record GetCustomBurgerDTO(
    Long id,
    GetUsuarioDTO usuario,
    List<GetIngredienteDTO> ingredientes,
    BigDecimal preco,
    LocalDateTime dataCriacao
) {} 