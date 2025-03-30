import React from "react";
import { Link } from "react-router-dom";

const ServicosList = ({
  servicos,
  servico,
  alunos,
  arquivados,
  isEditing,
  servicoAtual,
  handleEditClick,
  handleNameChange,
  handlePriceChange,
  handleSave,
}) => {
  if (!servico) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Lista de Serviços
        </h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.map((servico, index) => (
            <li
              key={index}
              className="bg-green-950 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Link
                to={`/servico/${servico.nome}`}
                className="text-white hover:text-green-700 font-medium"
              >
                {servico.nome}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">{servico}</h1>

        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Editar Serviço
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-green-950 p-6 rounded-lg shadow mb-8">
          <div className="mb-4">
            <label className="block text-white mb-2">Nome:</label>
            <input
              type="text"
              value={servicoAtual.nome}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Preço:</label>
            <input
              type="text"
              value={servicoAtual.preco}
              onChange={handlePriceChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Salvar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-green-950 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b">
            Ativos
          </h2>
          <ul className="space-y-2">
            {alunos
              .filter((aluno) => !arquivados.some((a) => a.id === aluno.id))
              .map((aluno) => (
                <li key={aluno.id}>
                  <Link
                    to={`/alunos/${aluno.id}/${servico}`}
                    className="text-white hover:text-green-800"
                  >
                    {aluno.nome}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-green-950 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b">
            Inativos
          </h2>
          <ul className="space-y-2">
            {arquivados.map((aluno) => (
              <li key={aluno.id}>
                <Link
                  to={`/alunos/${aluno.id}/${servico}`}
                  className="text-white hover:text-green-500"
                >
                  {aluno.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const AlunoDetails = ({ aluno, dataInicio, dataVencimento }) => {
  if (!aluno) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-950 p-6 rounded-lg shadow text-center">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-green-950 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-white mb-6">
          Detalhes do Aluno
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-950 p-4 rounded">
            <p className="text-white">
              <strong className="text-white">Nome:</strong> {aluno.nome}
            </p>
          </div>
          <div className="bg-green-950 p-4 rounded">
            <p className="text-white">
              <strong className="text-white">Telefone:</strong> {aluno.fone}
            </p>
          </div>
          <div className="bg-green-950 p-4 rounded">
            <p className="text-white">
              <strong className="text-white">Email:</strong> {aluno.email}
            </p>
          </div>
          <div className="bg-green-950 p-4 rounded">
            <p className="text-white">
              <strong className="text-white">Endereço:</strong> {aluno.endereco}
            </p>
          </div>
          <div className="bg-green-950 p-4 rounded">
            <p className="text-white">
              <strong className="text-white">Data de inicio:</strong>{" "}
              {dataInicio
                ? new Date(dataInicio).toLocaleDateString()
                : "Não disponível"}
            </p>
          </div>
          <div className="bg-green-950 p-4 rounded">
            <p className="text-white">
              <strong className="text-white">Data de Vencimento:</strong>{" "}
              {dataVencimento
                ? new Date(dataVencimento).toLocaleDateString()
                : "Não disponível"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateAlunoForm = ({
  nome,
  fone,
  email,
  endereco,
  setNome,
  setFone,
  setEmail,
  setEndereco,
  handleUpdate,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-green-950 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-white mb-6">
          Atualizar Dados do Aluno
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Telefone:</label>
            <input
              type="text"
              value={fone}
              onChange={(e) => setFone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-white mb-2">E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Endereço:</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
          >
            Atualizar
          </button>
        </form>
      </div>
    </div>
  );
};

const List = ({ tipo, ...props }) => {
  switch (tipo) {
    case "servico":
      return <ServicosList {...props} />;
    case "aluno":
      return <AlunoDetails {...props} />;
    case "updateAluno":
      return <UpdateAlunoForm {...props} />;
    default:
      return null;
  }
};

export default List;
