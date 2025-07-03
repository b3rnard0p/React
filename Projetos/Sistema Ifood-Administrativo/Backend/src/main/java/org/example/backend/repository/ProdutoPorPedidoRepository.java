package org.example.backend.repository;
import org.example.backend.model.ProdutoPorPedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoPorPedidoRepository extends JpaRepository<ProdutoPorPedido, Long> {
}
