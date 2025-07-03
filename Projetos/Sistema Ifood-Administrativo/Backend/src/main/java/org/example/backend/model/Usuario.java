package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    
    private String email;
    
    private String telefone;
    
    private String rua;
    
    private String numero;
    
    private String complemento;
    
    private String cidade;
    
    private String estado;
    
    private String cep;
    
    private String token;
} 