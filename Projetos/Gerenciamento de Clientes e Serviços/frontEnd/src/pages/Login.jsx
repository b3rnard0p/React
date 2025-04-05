import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLogin from "../components/FormLogin";
const Login = ({ authenticateUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const isAuthenticated = authenticateUser(username, password);

    if (isAuthenticated) {
      navigate("/");
    } else {
      setError("Credenciais inválidas, tente novamente.");
    }
  };

  return (
    <FormLogin
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
      handleLogin={handleLogin}
    />
  );
};

export default Login;
