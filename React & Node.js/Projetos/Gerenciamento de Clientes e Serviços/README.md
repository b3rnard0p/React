
# 🏥 Sistema de Gerenciamento para Clínica

## 📌 Sobre o Projeto
Este projeto é um sistema de gerenciamento para uma clínica que oferece múltiplos serviços e atende alunos. O sistema permite administrar tanto os serviços prestados quanto os alunos cadastrados, garantindo eficiência no controle de atendimentos e registros. Além de gerar relatórios em PDF.

---

## 🚀 Tecnologias Utilizadas

### **Frontend**
- React
- Vite
- TailwindCSS

### **Backend**
- Node.js
- Express
- MYSql

---

## 📂 Estrutura do Projeto

```
GerenciamentoClinica/
│── backend/
│   ├── api/
│   │   ├── connect.js
│   │   ├── server.js
│   ├── package-lock.json
│   ├── package.json
│
│── frontEnd/
│   ├── api/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/ (TailwindCSS)
│   │   ├── App.jsx
│   │   ├── main.jsx
```

---

## ⚙️ Configuração e Instalação

### **1️⃣ Criar o projeto com Vite**

1.1 - Execute o seguinte comando no terminal:
```sh
npm create vite@latest .
```
1.2 - Escolha a tecnologia **React**

1.3 - Escolha a linguagem **JavaScript** ou **TypeScript**

---

### **2️⃣ Instalar as dependências**

2.1 - No diretório do **frontend**, instale os pacotes necessários:
```sh
npm i
```
2.2 - Instale o TailwindCSS:
```sh
npm install -D tailwindcss postcss autoprefixer
```
2.3 - Inicialize a configuração do Tailwind:
```sh
npx tailwindcss init -p
```
2.4 - Configure o Tailwind no arquivo `tailwind.config.js`:
```js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
2.5 - No arquivo `index.css`, importe o TailwindCSS:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### **3️⃣ Iniciar o servidor**

3.1 - Para rodar o **frontend**:
```sh
npm run dev
```

3.2 - Para rodar o **backend**:
```sh
node backend/api/server.js
```

📌 **OBS:** Certifique-se de ter o **Node.js** instalado para executar o projeto corretamente.

---

## 📌 Funcionalidades
✅ Cadastro de alunos
✅ Gerenciamento de serviços oferecidos
✅ Controle de agendamentos e atendimentos
✅ Registro e histórico de consultas
✅ Integração com banco de dados MongoDB

---

### 💻 Desenvolvido por b3rnard0p

