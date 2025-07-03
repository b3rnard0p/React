package org.example.backend.config;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.example.backend.model.Combo;
import org.example.backend.model.CustomBurger;
import org.example.backend.model.FormaPagamento;
import org.example.backend.model.Ingrediente;
import org.example.backend.model.Pedido;
import org.example.backend.model.Produto;
import org.example.backend.model.ProdutoPorPedido;
import org.example.backend.model.StatusPedido;
import org.example.backend.model.Usuario;
import org.example.backend.repository.ComboRepository;
import org.example.backend.repository.CustomBurgerRepository;
import org.example.backend.repository.IngredienteRepository;
import org.example.backend.repository.PedidoRepository;
import org.example.backend.repository.ProdutoPorPedidoRepository;
import org.example.backend.repository.ProdutoRepository;
import org.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private IngredienteRepository ingredienteRepository;
    @Autowired
    private ProdutoRepository produtoRepository;
    @Autowired
    private ComboRepository comboRepository;
    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private ProdutoPorPedidoRepository produtoPorPedidoRepository;
    @Autowired
    private CustomBurgerRepository customBurgerRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        // Ingredientes
        if (ingredienteRepository.count() == 0) {
            criarIngredientesIniciais();
        }
        // Produtos
        if (produtoRepository.count() == 0) {
            criarProdutosIniciais();
        }
        // Usuários
        if (usuarioRepository.count() == 0) {
            criarUsuariosIniciais();
        }
        // Combos
        if (comboRepository.count() == 0) {
            criarCombosIniciais();
        }
        // Custom Burgers
        if (customBurgerRepository.count() == 0) {
            criarCustomBurgersIniciais();
        }
        // Pedidos
        if (pedidoRepository.count() == 0) {
            criarPedidosIniciais();
        }
    }

    private void criarIngredientesIniciais() {
        List<Ingrediente> ingredientes = Arrays.asList(
            // Pães
            criarIngrediente("Pão de Hambúrguer", "pão", new BigDecimal("3.50"), 50),
            criarIngrediente("Pão Australiano", "pão", new BigDecimal("4.00"), 30),
            criarIngrediente("Pão Brioche", "pão", new BigDecimal("4.50"), 25),
            
            // Carnes
            criarIngrediente("Carne de Hambúrguer", "carne", new BigDecimal("8.00"), 40),
            criarIngrediente("Carne de Frango", "carne", new BigDecimal("6.50"), 35),
            criarIngrediente("Carne de Porco", "carne", new BigDecimal("7.50"), 30),
            criarIngrediente("Carne de Cordeiro", "carne", new BigDecimal("12.00"), 20),
            
            // Queijos
            criarIngrediente("Queijo Cheddar", "queijo", new BigDecimal("2.50"), 60),
            criarIngrediente("Queijo Mussarela", "queijo", new BigDecimal("2.00"), 70),
            criarIngrediente("Queijo Gorgonzola", "queijo", new BigDecimal("4.00"), 25),
            criarIngrediente("Queijo Provolone", "queijo", new BigDecimal("3.00"), 40),
            
            // Molhos
            criarIngrediente("Molho Especial", "molho", new BigDecimal("1.50"), 80),
            criarIngrediente("Molho Barbecue", "molho", new BigDecimal("1.80"), 60),
            criarIngrediente("Molho Ranch", "molho", new BigDecimal("2.00"), 50),
            criarIngrediente("Molho Picante", "molho", new BigDecimal("1.20"), 70),
            
            // Vegetais
            criarIngrediente("Alface", "vegetal", new BigDecimal("0.80"), 100),
            criarIngrediente("Tomate", "vegetal", new BigDecimal("1.20"), 80),
            criarIngrediente("Cebola", "vegetal", new BigDecimal("0.60"), 90),
            criarIngrediente("Pepino", "vegetal", new BigDecimal("0.90"), 70),
            criarIngrediente("Pimentão", "vegetal", new BigDecimal("1.50"), 60),
            
            // Temperos
            criarIngrediente("Sal e Pimenta", "tempero", new BigDecimal("0.30"), 200),
            criarIngrediente("Orégano", "tempero", new BigDecimal("0.50"), 150),
            criarIngrediente("Páprica", "tempero", new BigDecimal("0.70"), 120),
            criarIngrediente("Alecrim", "tempero", new BigDecimal("0.80"), 100)
        );

        ingredienteRepository.saveAll(ingredientes);
        System.out.println("✅ Ingredientes iniciais criados com sucesso!");
    }

    private Ingrediente criarIngrediente(String nome, String tipo, BigDecimal preco, Integer estoque) {
        Ingrediente ingrediente = new Ingrediente();
        ingrediente.setNome(nome);
        ingrediente.setTipo(tipo);
        ingrediente.setPreco(preco);
        ingrediente.setEstoque(estoque);
        ingrediente.setAtivo(true);
        return ingrediente;
    }

    private void criarProdutosIniciais() {
        List<Produto> produtos = Arrays.asList(
            criarProduto("Clássico Bacon", "Pão brioche, hambúrguer 180g, queijo cheddar, bacon crocante e maionese especial.", new BigDecimal("29.9"), "HAMBURGUER", true, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNMEyVsK2Sb0hq8ZJDPBRQkKzwZ2lICuPAqw&s"),
            criarProduto("Cheddar Duplo", "Dois hambúrgueres 150g, cheddar derretido e cebola caramelizada.", new BigDecimal("34.5"), "HAMBURGUER", true, "https://api-middleware-mcd.mcdonaldscupones.com/media/image/product$kzXWKJ6A/200/200/original?country=br"),
            criarProduto("Veggie Delight", "Hambúrguer de grão-de-bico, alface, tomate e molho vegano no pão integral.", new BigDecimal("27.0"), "HAMBURGUER", true, "https://goldenparadisebd.com/wp-content/uploads/2024/12/Veggie-Delight-Burger.jpg"),
            criarProduto("Refrigerante Lata", "Coca-Cola, Guaraná ou Fanta – 350ml.", new BigDecimal("6.0"), "BEBIDA", true, "https://zaffari.vtexassets.com/arquivos/ids/276576/1007841-00.jpg?v=638802406334870000"),
            criarProduto("Suco Natural", "Suco natural de laranja ou limão, feito na hora – 300ml.", new BigDecimal("8.0"), "BEBIDA", true, "https://cantinagoodlanche.com.br/wp-content/uploads/2020/07/beneficios-dos-sucos-naturais-1-alfa-hotel.jpg"),
            criarProduto("Água Mineral", "Garrafa 500ml, com ou sem gás.", new BigDecimal("4.0"), "BEBIDA", true, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmE-kl1CimSZ8Z6wd2ff0GYQJVXgHAntYFbg&s"),
            criarProduto("Brownie com Sorvete", "Brownie de chocolate com bola de sorvete de creme e calda de chocolate.", new BigDecimal("14.9"), "SOBREMESA", true, "https://www.specialita.com/wp-content/uploads/2022/07/brownie-de-chocoavela-com-sorvete.jpg"),
            criarProduto("Milkshake Morango", "Milkshake cremoso de morango com chantilly.", new BigDecimal("12.0"), "SOBREMESA", true, "https://img.cdndsgni.com/preview/10101275.jpg"),
            criarProduto("Petit Gateau", "Bolo quente com recheio de chocolate e sorvete de creme.", new BigDecimal("15.9"), "SOBREMESA", true, "https://receitatodahora.com.br/wp-content/uploads/2022/02/petit-gateau-scaled.jpg")
        );
        produtoRepository.saveAll(produtos);
    }

    private Produto criarProduto(String nome, String descricao, BigDecimal preco, String categoria, boolean disponibilidade, String imagem) {
        Produto p = new Produto();
        p.setNome(nome);
        p.setDescricao(descricao);
        p.setPreco(preco);
        p.setCategoria(categoria != null ? org.example.backend.model.Categoria.valueOf(categoria) : null);
        p.setDisponibilidade(disponibilidade);
        p.setImagem(imagem);
        p.setDeleted(false);
        return p;
    }

    private void criarCombosIniciais() {
        List<Produto> produtos = produtoRepository.findAll();
        Combo combo1 = new Combo();
        combo1.setNome("Combo Clássico");
        combo1.setDescricao("Hambúrguer Clássico + Refrigerante Lata + Batata Frita");
        combo1.setProdutoHamburguer(produtos.get(0));
        combo1.setProdutoBebida(produtos.get(3));
        combo1.setProdutoSobremesa(produtos.get(6));
        combo1.setPrecoCombo(new BigDecimal("40.00"));
        combo1.setAtivo(true);
        combo1.setDeleted(false);

        Combo combo2 = new Combo();
        combo2.setNome("Combo Vegano");
        combo2.setDescricao("Hambúrguer Vegano + Suco Natural + Onion Rings");
        combo2.setProdutoHamburguer(produtos.get(2));
        combo2.setProdutoBebida(produtos.get(4));
        combo2.setProdutoSobremesa(produtos.get(7));
        combo2.setPrecoCombo(new BigDecimal("45.00"));
        combo2.setAtivo(true);
        combo2.setDeleted(false);

        Combo combo3 = new Combo();
        combo3.setNome("Combo Doce");
        combo3.setDescricao("Hambúrguer Duplo + Água Mineral + Brownie");
        combo3.setProdutoHamburguer(produtos.get(1));
        combo3.setProdutoBebida(produtos.get(5));
        combo3.setProdutoSobremesa(produtos.get(8));
        combo3.setPrecoCombo(new BigDecimal("48.00"));
        combo3.setAtivo(true);
        combo3.setDeleted(false);

        comboRepository.saveAll(Arrays.asList(combo1, combo2, combo3));
    }

    private void criarCustomBurgersIniciais() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Ingrediente> ingredientes = ingredienteRepository.findAll();
        CustomBurger cb1 = new CustomBurger();
        cb1.setUsuario(usuarios.get(0));
        cb1.setIngredientes(ingredientes.subList(0, 5));
        cb1.setPreco(new BigDecimal("22.00"));
        cb1.setDataCriacao(java.time.LocalDateTime.now().minusDays(10));

        CustomBurger cb2 = new CustomBurger();
        cb2.setUsuario(usuarios.get(1));
        cb2.setIngredientes(ingredientes.subList(5, 10));
        cb2.setPreco(new BigDecimal("25.00"));
        cb2.setDataCriacao(java.time.LocalDateTime.now().minusDays(7));

        CustomBurger cb3 = new CustomBurger();
        cb3.setUsuario(usuarios.get(2));
        cb3.setIngredientes(ingredientes.subList(10, 15));
        cb3.setPreco(new BigDecimal("28.00"));
        cb3.setDataCriacao(java.time.LocalDateTime.now().minusDays(3));

        customBurgerRepository.saveAll(Arrays.asList(cb1, cb2, cb3));
    }

    private void criarPedidosIniciais() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Produto> produtos = produtoRepository.findAll();
        List<Combo> combos = comboRepository.findAll();
        List<CustomBurger> customBurgers = customBurgerRepository.findAll();
        java.util.Random rand = new java.util.Random();
        for (int i = 0; i < 10; i++) {
            Pedido pedido = new Pedido();
            pedido.setUsuario(usuarios.get(i % usuarios.size()));
            pedido.setData(new java.util.Date(System.currentTimeMillis() - rand.nextInt(15) * 24 * 60 * 60 * 1000L));
            pedido.setStatus(StatusPedido.ENTREGUE);
            pedido.setFormaPagamento(FormaPagamento.DINHEIRO);
            java.util.List<ProdutoPorPedido> itens = new java.util.ArrayList<>();
            // Alterna entre combos, custom burgers e produtos normais
            if (i % 3 == 0) {
                // Combo
                Combo combo = combos.get(i % combos.size());
                ProdutoPorPedido ppp = new ProdutoPorPedido();
                ppp.setPedido(pedido);
                ppp.setProduto(combo.getProdutoHamburguer());
                ppp.setQuantidade(1);
                ppp.setPrecoUnitario(combo.getPrecoCombo());
                itens.add(ppp);
            } else if (i % 3 == 1) {
                // Custom Burger
                CustomBurger cb = customBurgers.get(i % customBurgers.size());
                ProdutoPorPedido ppp = new ProdutoPorPedido();
                ppp.setPedido(pedido);
                ppp.setCustomBurger(cb);
                ppp.setQuantidade(1);
                ppp.setPrecoUnitario(cb.getPreco());
                itens.add(ppp);
            } else {
                // Produto normal
                Produto prod = produtos.get(i % produtos.size());
                ProdutoPorPedido ppp = new ProdutoPorPedido();
                ppp.setPedido(pedido);
                ppp.setProduto(prod);
                ppp.setQuantidade(1);
                ppp.setPrecoUnitario(prod.getPreco());
                itens.add(ppp);
            }
            pedido.setProdutos(itens);
            pedido.setTotal(itens.stream().map(ppp -> ppp.getPrecoUnitario().multiply(new BigDecimal(ppp.getQuantidade()))).reduce(BigDecimal.ZERO, BigDecimal::add));
            pedidoRepository.save(pedido);
        }
    }

    private void criarUsuariosIniciais() {
        List<Usuario> usuarios = Arrays.asList(
            criarUsuario("João Silva", "joao@email.com", "11999999999", "Rua A", "100", "", "São Paulo", "SP", "01000-000", "token1"),
            criarUsuario("Maria Souza", "maria@email.com", "11988888888", "Rua B", "200", "Ap 12", "Rio de Janeiro", "RJ", "20000-000", "token2"),
            criarUsuario("Carlos Lima", "carlos@email.com", "11977777777", "Rua C", "300", "Casa", "Belo Horizonte", "MG", "30000-000", "token3")
        );
        usuarioRepository.saveAll(usuarios);
    }

    private Usuario criarUsuario(String nome, String email, String telefone, String rua, String numero, String complemento, String cidade, String estado, String cep, String token) {
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setEmail(email);
        u.setTelefone(telefone);
        u.setRua(rua);
        u.setNumero(numero);
        u.setComplemento(complemento);
        u.setCidade(cidade);
        u.setEstado(estado);
        u.setCep(cep);
        u.setToken(token);
        return u;
    }
} 