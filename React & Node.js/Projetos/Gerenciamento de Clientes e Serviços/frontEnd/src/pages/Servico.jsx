import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  atualizarServico,
  getAlunosByServico,
  getServicos,
} from "../../api/api";
import List from "../components/List";

const Servico = () => {
  const { servico } = useParams();
  const [servicos, setServicos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [arquivados, setArquivados] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [servicoAtual, setServicoAtual] = useState({
    id: null,
    nome: "",
    preco: "",
  });

  useEffect(() => {
    const fetchServicos = async () => {
      const data = await getServicos();
      setServicos(data);

      if (servico) {
        const servicoData = data.find((s) => s.nome === servico);

        if (servicoData && servicoData.id) {
          setServicoAtual({
            id: servicoData.id,
            nome: servicoData.nome || "",
            preco: servicoData.preco || "",
          });
        } else {
          console.error(
            "Serviço não encontrado ou ID ausente no array de serviços"
          );
        }
      }
    };

    fetchServicos();
  }, [servico]);

  useEffect(() => {
    if (servico) {
      const fetchAlunos = async () => {
        const alunosData = await getAlunosByServico(servico);
        setAlunos(alunosData);

        const arquivadosSalvos =
          JSON.parse(localStorage.getItem("arquivados")) || [];
        setArquivados(
          alunosData.filter((aluno) => arquivadosSalvos.includes(aluno.id))
        );
      };

      fetchAlunos();
    }
  }, [servico]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!servicoAtual.id) {
      console.error("ID do serviço não encontrado:", servicoAtual);
      return;
    }

    try {
      await atualizarServico(servicoAtual.id, {
        nome: servicoAtual.nome,
        preco: servicoAtual.preco,
      });
      setIsEditing(false);

      const data = await getServicos();
      setServicos(data);
    } catch (error) {
      console.error("Erro ao atualizar serviço", error);
    }
  };

  const handleNameChange = (e) => {
    setServicoAtual({ ...servicoAtual, nome: e.target.value });
  };

  const handlePriceChange = (e) => {
    setServicoAtual({ ...servicoAtual, preco: e.target.value });
  };

  return (
    <List
      tipo="servico"
      servico={servico}
      servicos={servicos}
      alunos={alunos}
      arquivados={arquivados}
      isEditing={isEditing}
      servicoAtual={servicoAtual}
      handleEditClick={handleEditClick}
      handleSave={handleSave}
      handleNameChange={handleNameChange}
      handlePriceChange={handlePriceChange}
    />
  );
};

export default Servico;
