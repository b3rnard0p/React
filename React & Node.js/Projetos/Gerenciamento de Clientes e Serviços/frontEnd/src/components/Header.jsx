import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/Logo.jpg";
import "../styles/styles.css";

const Header = () => {
  const userRole = localStorage.getItem("userRole");

  return (
    <div className="grid grid-cols-6 m-4  bg-green-950 rounded-lg p-4">
      <Link to="/">
        <img class="w-8" src={logo} alt="Logo Bem-Estar" />
      </Link>

      <Link className="self-center justify-self-center" to="/Registro">
        <h1 className="text-white font-serif">Registro</h1>
      </Link>
      <Link className="self-center justify-self-center" to="/servico">
        <h1 className="text-white font-serif">Serviços</h1>
      </Link>

      {userRole === "admin" && (
        <>
          <Link className="self-center justify-self-center" to="/caixa">
            <h1 className="text-white font-serif">Caixa</h1>
          </Link>
          <Link className="self-center justify-self-center" to="/relatorio">
            <h1 className="text-white font-serif">Relatórios</h1>
          </Link>
        </>
      )}

      <Link className="justify-self-end" to="/login">
        <h1 className="text-white font-serif">Login</h1>
      </Link>
    </div>
  );
};

export default Header;
