import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  atualizarPagamento,
  buscarServicoId,
  getAlunoById,
  getAlunoServico,
} from "../../api/api";
import List from "../components/List";

const Aluno = () => {
  const { id, servico } = useParams();
  const [aluno, setAluno] = useState(null);
  const [arquivado, setArquivado] = useState(false);
  const [servicoId, setServicoId] = useState(null);
  const [dataVencimento, setDataVencimento] = useState(null);
  const [dataInicio, setDataInicio] = useState(null);

  useEffect(() => {
    const fetchAluno = async () => {
      const data = await getAlunoById(id);
      if (data) {
        setAluno(data);
        const arquivados = JSON.parse(localStorage.getItem("arquivados")) || [];
        setArquivado(arquivados.includes(data.id));
      }
    };

    if (id) {
      fetchAluno();
    } else {
      console.error("ID não encontrado.");
    }
  }, [id]);

  useEffect(() => {
    if (aluno && servico) {
      const fetchDataInicio = async () => {
        try {
          const vinculos = await getAlunoServico();
          const vinculoAtual = vinculos.find(
            (v) => v.aluno === aluno?.nome && v.servico === servico
          );

          if (vinculoAtual) {
            setDataInicio(vinculoAtual.data_inicio);
          }
        } catch (error) {
          console.error("Erro ao buscar a data de inicio:", error);
        }
      };

      const fetchDataVencimento = async () => {
        try {
          const vinculos = await getAlunoServico();
          const vinculoAtual = vinculos.find(
            (v) => v.aluno === aluno?.nome && v.servico === servico
          );

          if (vinculoAtual) {
            setDataVencimento(vinculoAtual.data_vencimento);
          }
        } catch (error) {
          console.error("Erro ao buscar a data de vencimento:", error);
        }
      };

      fetchDataInicio();
      fetchDataVencimento();
    }
  }, [aluno, servico]);
  const toggleArquivar = () => {
    let arquivados = JSON.parse(localStorage.getItem("arquivados")) || [];

    if (arquivado) {
      arquivados = arquivados.filter((alunoId) => alunoId !== aluno.id);
    } else {
      arquivados.push(aluno.id);
    }

    localStorage.setItem("arquivados", JSON.stringify(arquivados));
    setArquivado(!arquivado);
  };

  const fetchServicoId = async (nomeServico) => {
    try {
      const servicoId = await buscarServicoId(nomeServico);
      if (servicoId) {
        setServicoId(servicoId);
        return servicoId;
      }
    } catch (error) {
      console.error("Erro ao buscar o ID do serviço:", error);
      return null;
    }
  };

  const handlePagamento = async () => {
    try {
      const servicoId = await fetchServicoId(servico);

      if (!servicoId) {
        alert("Serviço não encontrado.");
        return;
      }

      await atualizarPagamento(id, servicoId);
      alert("Data de pagamento atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar data de pagamento", error);
      alert("Erro ao atualizar data de pagamento.");
    }
  };

  if (!aluno) {
    return <p>Aluno não encontrado.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-green-950 p-6 rounded-lg shadow mb-6">
        <List
          tipo="aluno"
          aluno={aluno}
          dataVencimento={dataVencimento}
          dataInicio={dataInicio}
        />
      </div>

      <div className="bg-green-950 p-6 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={toggleArquivar}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors"
          >
            {arquivado ? "Desarquivar" : "Arquivar"}
          </button>

          <Link
            to={`/atualiza/${id}`}
            className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors"
          >
            Atualizar Dados
          </Link>

          <Link
            to={`/deletar/${id}`}
            className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors"
          >
            Deletar aluno
          </Link>

          <button
            onClick={handlePagamento}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors"
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Aluno;
