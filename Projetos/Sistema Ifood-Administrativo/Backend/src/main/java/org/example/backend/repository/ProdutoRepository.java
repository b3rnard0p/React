package org.example.backend.repository;

import java.util.List;

import org.example.backend.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findAllByDeletedFalse();
}
