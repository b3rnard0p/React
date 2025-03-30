import React from "react";

const FormLogin = ({
  username,
  setUsername,
  password,
  setPassword,
  error,
  handleLogin,
}) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-20 bg-green-950 rounded-lg ">
      <h2 className="text-4xl font-serif text-center text-white mb-6">Login</h2>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-white text-sm font-bold mb-2"
        >
          Usuário:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-white text-sm font-bold mb-2"
        >
          Senha:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      <button
        onClick={handleLogin}
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Entrar
      </button>
    </div>
  );
};

export default FormLogin;
