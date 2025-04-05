import React from "react";

const CaixaInfo = ({
  dataPesquisa,
  setDataPesquisa,
  filtrarPagamentos,
  pagamentosFiltrados,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Caixa</h1>

      <div className="bg-green-950 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Filtrar Pagamentos
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={dataPesquisa}
            onChange={(e) => setDataPesquisa(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={filtrarPagamentos}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
          >
            Pesquisar
          </button>
        </div>
      </div>

      <div className="bg-green-950 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Pagamentos</h2>

        {pagamentosFiltrados.length === 0 ? (
          <p className="text-gray-500 italic">
            Não há pagamentos registrados para esta data.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Data do Pagamento
                  </th>
                </tr>
              </thead>
              <tbody className="bg-green-950 divide-y divide-gray-200">
                {pagamentosFiltrados.map((pagamento, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {pagamento.aluno_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {pagamento.servico_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(pagamento.data_pagamento).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default CaixaInfo;
