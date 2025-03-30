✨ Replica do Spotify com React, Node.js e MongoDB

## 📌 Sobre o Projeto
Este projeto é uma réplica do Spotify desenvolvida utilizando tecnologias modernas para web. Ele permite a reprodução de músicas, gerenciamento de playlists e interação do usuário com uma interface responsiva.

## 🚀 Tecnologias Utilizadas
- **Front-end**: React, Vite
- **Back-end**: Node.js, Express
- **Banco de Dados**: MongoDB
- **Outras tecnologias**: JavaScript, HTML e CSS

## 💂️ Estrutura do Projeto
```
Spotify/
│── BackEnd/
│   ├── api/
│   │   ├── connect.js
│   │   ├── insertMany.js
│   │   ├── server.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│
│── FrontEnd/
│   ├── api/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
```

## 🛠️ Configuração e Instalação

### 1️⃣ Criar Vite
```sh
npm create vite@latest .
```
1. Escolha a tecnologia que vai usar
2. Escolha a linguagem que vai usar

### 2️⃣ Instalar o node_modules
```sh
npm i
```

### 3️⃣ Iniciar o servidor
```sh
npm run dev
```

**OBS:** É necessário ter o Node.js instalado.

### 4️⃣ Configurar o Backend
```sh
cd BackEnd
npm install
```

- Criar um banco no MongoDB e configurar a conexão no arquivo `connect.js`.
- Rodar o servidor:
```sh
node server.js
```

### 5️⃣ Configurar o Frontend
```sh
cd FrontEnd
npm install
npm run dev
```

## 📈 Funcionalidades
- Reprodução de músicas
- Gerenciamento de playlists
- Interface responsiva
- Integração com banco de dados MongoDB

## 📊 Melhorias Futuras
- Sistema de autenticação de usuário
- Reprodução em segundo plano
- Integração com API oficial do Spotify

## 🚀 Desenvolvido por [seu-usuário]

