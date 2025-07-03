# Sistema Restaurante

Este sistema é composto por um **backend** em Java (Spring Boot) e um **frontend** em React + TypeScript. Ele permite a gestão de produtos, ingredientes, combos, pedidos e usuários, com funcionalidades específicas para administradores e clientes.

---

## Funcionalidades Principais

### Para Administradores

- **Gestão de Produtos:** criar, editar, visualizar e remover produtos do cardápio.
- **Gestão de Ingredientes:** adicionar, editar, listar e remover ingredientes.
- **Gestão de Combos:** criar, editar, listar e remover combos promocionais.
- **Gestão de Pedidos:** visualizar todos os pedidos, alterar status e detalhes.
- **Gestão de Usuários:** visualizar, editar e remover usuários do sistema.
- **Gestão de Custom Burgers:** visualizar todos os hambúrgueres personalizados criados por clientes.
- **Login de Administrador:** acesso restrito via autenticação.

### Para Clientes

- **Cadastro e Edição de Perfil:** criar conta, editar dados e visualizar perfil.
- **Visualização de Produtos e Combos:** acessar o cardápio completo e combos ativos.
- **Montagem de Hambúrguer Personalizado:** escolher ingredientes e criar seu próprio lanche.
- **Realização de Pedidos:** montar o carrinho, finalizar pedido e acompanhar status.
- **Acompanhamento de Pedidos:** visualizar histórico e status dos pedidos realizados.

---

## Tecnologias Utilizadas

- **Backend:** Java 17, Spring Boot 3, Spring Security, JPA, MySQL, JWT.
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, React Router, Axios, React Query.

---

## Como Executar o Projeto

### Pré-requisitos

- **Java 17+**
- **Node.js 18+ e npm**
- **MySQL** rodando na porta padrão (3306)

### Configuração do Banco de Dados

O backend está configurado para conectar em:

```
spring.datasource.url=jdbc:mysql://localhost:3306/Restaurante?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=SUA_SENHA
```

> Altere `spring.datasource.password` em `Backend/src/main/resources/application.properties` conforme sua senha do MySQL.

O banco será criado automaticamente ao rodar o backend.

---

### Backend

1. Acesse a pasta `Backend`.
2. Execute o comando:
   - **Windows:** `mvnw.cmd spring-boot:run`
   - **Linux/Mac:** `./mvnw spring-boot:run`
3. O backend estará disponível em `http://localhost:8080`.

#### Endpoints Úteis

- `POST /api/auth/login` — Login de administrador.
- `GET /api/auth/setup-admin` — Cria um admin padrão (`admin`/`admin123`).
- `GET /api/cliente/combos/ativos` — Lista combos ativos para clientes.
- `GET /api/admin/combos` — Lista combos para admin.
- `POST /api/cliente/pedidos` — Cria pedido de cliente.
- `GET /api/admin/pedidos` — Lista todos os pedidos (admin).
- ...e outros para produtos, ingredientes, usuários, custom burgers.

---

### Frontend

1. Acesse a pasta `front`.
2. Instale as dependências:
   ```
   npm install
   ```
3. Rode o projeto:
   ```
   npm run dev
   ```
4. Acesse `http://localhost:5173` no navegador.

---

## Fluxo de Usuário

- **Cliente:** pode se cadastrar, montar pedidos, criar hambúrguer personalizado, acompanhar pedidos e editar perfil.
- **Administrador:** faz login, gerencia produtos, ingredientes, combos, pedidos e usuários.

---

## Observações

- O sistema utiliza autenticação JWT para administradores.
- O frontend e backend devem rodar simultaneamente para funcionamento completo.
- O admin padrão pode ser criado acessando `/api/auth/setup-admin` após subir o backend.

---

## Scripts Úteis

### Backend

- `mvnw spring-boot:run` — Inicia o backend.
- `mvnw test` — Executa os testes.

### Frontend

- `npm run dev` — Inicia o frontend em modo desenvolvimento.
- `npm run build` — Gera build de produção.
- `npm run lint` — Verifica padrões de código.

---

## Estrutura de Pastas

```
Sistema-Restaurante/
  ├── Backend/      # Backend Java Spring Boot
  └── front/        # Frontend React + TypeScript
```

---
