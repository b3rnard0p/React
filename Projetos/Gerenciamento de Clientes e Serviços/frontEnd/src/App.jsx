import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import useAuth from "./components/Authentication.jsx";
import DeleteAluno from "./components/DeleteAluno.jsx";
import Header from "./components/Header.jsx";
import UpdateAluno from "./components/UpdateAluno.jsx";
import Aluno from "./pages/Aluno.jsx";
import Caixa from "./pages/Caixa.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Registro from "./pages/Registro.jsx";
import Relatorio from "./pages/Relatorio.jsx";
import {
  default as Servico,
  default as ServicoEspecifico,
} from "./pages/Servico.jsx";

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, userRole, authenticateUser } = useAuth();

  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/servico/:servico" element={<ServicoEspecifico />} />
        <Route path="/servico" element={<Servico />} />
        <Route path="/alunos/:id/:servico" element={<Aluno />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/atualiza/:id" element={<UpdateAluno />} />
        <Route path="/deletar/:id" element={<DeleteAluno />} />
        <Route
          path="/login"
          element={<Login authenticateUser={authenticateUser} />}
        />
        <Route
          path="/caixa"
          element={userRole === "admin" ? <Caixa /> : <Navigate to="/" />}
        />
        <Route
          path="/relatorio"
          element={userRole === "admin" ? <Relatorio /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
