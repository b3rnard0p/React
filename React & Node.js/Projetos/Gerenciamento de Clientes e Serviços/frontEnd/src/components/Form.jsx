import React from "react";

const FormRegister = ({ formData, handleChange, handleSubmit, mensagem }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-green-950 p-6 rounded-lg shadow-md mb-8 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold text-white mb-4">Cadastrar Aluno</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="fone"
          value={formData.fone}
          onChange={handleChange}
          placeholder="Telefone"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          placeholder="Endereço"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Cadastrar
      </button>
      {mensagem && (
        <p className="mt-4 text-green-200 text-center">{mensagem}</p>
      )}
    </form>
  );
};

const FormService = ({
  formServico,
  handleServicoChange,
  handleSubmitServico,
  mensagemServico,
}) => {
  return (
    <form
      onSubmit={handleSubmitServico}
      className="bg-green-950 p-6 rounded-lg shadow-md mb-8 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold text-white mb-4">Cadastrar Serviço</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="nome_servico"
          value={formServico.nome_servico}
          onChange={handleServicoChange}
          placeholder="Nome do Serviço"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="preco"
          value={formServico.preco}
          onChange={handleServicoChange}
          placeholder="Preço do Serviço"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Cadastrar Serviço
      </button>
      {mensagemServico && (
        <p className="mt-4 text-green-200 text-center">{mensagemServico}</p>
      )}
    </form>
  );
};

const FormLink = ({
  vinculoData,
  handleVinculoChange,
  handleVinculoSubmit,
  mensagemVinculo,
}) => {
  return (
    <form
      onSubmit={handleVinculoSubmit}
      className="bg-green-950 p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold text-white mb-4">
        Vincular Serviço ao Aluno
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          name="nome_aluno"
          value={vinculoData.nome_aluno}
          onChange={handleVinculoChange}
          placeholder="Nome do Aluno"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="nome_servico"
          value={vinculoData.nome_servico}
          onChange={handleVinculoChange}
          placeholder="Nome do Serviço"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Vincular Serviço
      </button>
      {mensagemVinculo && (
        <p className="mt-4 text-green-200 text-center">{mensagemVinculo}</p>
      )}
    </form>
  );
};

const Form = (props) => {
  return (
    <div className="container mx-auto px-4 py-8 grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <FormRegister {...props} />
      </div>
      <div className="md:col-span-1">
        <FormService {...props} />
      </div>
      <div className="md:col-span-1">
        <FormLink {...props} />
      </div>
    </div>
  );
};

export default Form;
