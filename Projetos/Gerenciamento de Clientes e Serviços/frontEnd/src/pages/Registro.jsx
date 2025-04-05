import React, { useState } from "react";
import {
  cadastrarAluno,
  cadastrarServico,
  vincularServico,
} from "../../api/api";
import Form from "../components/Form";

const Registro = () => {
  const [formData, setFormData] = useState({
    nome: "",
    fone: "",
    email: "",
    endereco: "",
  });

  const [vinculoData, setVinculoData] = useState({
    nome_aluno: "",
    nome_servico: "",
  });

  const [formServico, setFormServico] = useState({
    nome_servico: "",
    preco: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [mensagemVinculo, setMensagemVinculo] = useState("");
  const [mensagemServico, setMensagemServico] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVinculoChange = (e) => {
    setVinculoData({ ...vinculoData, [e.target.name]: e.target.value });
  };

  const handleServicoChange = (e) => {
    setFormServico({ ...formServico, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await cadastrarAluno(formData);
      if (response.status === 201) {
        setMensagem("Aluno cadastrado com sucesso!");
        setFormData({ nome: "", fone: "", email: "", endereco: "" });
      } else {
        setMensagem("Erro ao cadastrar aluno.");
      }
    } catch (error) {
      setMensagem("Erro ao conectar ao servidor.");
    }
  };

  const handleVinculoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await vincularServico(vinculoData);
      if (response.status === 201) {
        setMensagemVinculo("Serviço vinculado ao aluno com sucesso!");
        setVinculoData({ nome_aluno: "", nome_servico: "" });
      } else {
        setMensagemVinculo("Erro ao vincular serviço ao aluno.");
      }
    } catch (error) {
      setMensagemVinculo("Erro ao conectar ao servidor.");
    }
  };

  const handleSubmitServico = async (e) => {
    e.preventDefault();
    if (!formServico.nome_servico || !formServico.preco) {
      setMensagemServico("Por favor, preencha todos os campos.");
      return;
    }
    try {
      const response = await cadastrarServico({
        nome: formServico.nome_servico,
        preco: formServico.preco,
      });
      if (response.status === 201) {
        setMensagemServico("Serviço cadastrado com sucesso!");
        setFormServico({ nome_servico: "", preco: "" });
      } else {
        setMensagemServico("Erro ao cadastrar serviço.");
      }
    } catch (error) {
      setMensagemServico("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div>
      <Form
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        mensagem={mensagem}
        vinculoData={vinculoData}
        handleVinculoChange={handleVinculoChange}
        handleVinculoSubmit={handleVinculoSubmit}
        mensagemVinculo={mensagemVinculo}
        formServico={formServico}
        handleServicoChange={handleServicoChange}
        handleSubmitServico={handleSubmitServico}
        mensagemServico={mensagemServico}
      />
    </div>
  );
};

export default Registro;
