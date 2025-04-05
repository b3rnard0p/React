import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atualizarAluno, getAlunoById } from "../../api/api";
import List from "./List";

const UpdateAluno = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [fone, setFone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    getAlunoById(id)
      .then((aluno) => {
        setNome(aluno.nome);
        setFone(aluno.fone);
        setEmail(aluno.email);
        setEndereco(aluno.endereco);
      })
      .catch((error) => {
        console.error(`Erro ao buscar detalhes do aluno ${id}`, error);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    atualizarAluno(id, { nome, fone, email, endereco })
      .then((response) => {
        alert("Aluno atualizado com sucesso!");
        navigate(`/alunos/${id}`);
      })
      .catch((error) => {
        console.error("Erro ao atualizar aluno", error);
        alert("Erro ao atualizar aluno");
      });
  };

  return (
    <div>
      <List
        tipo="updateAluno"
        nome={nome}
        fone={fone}
        email={email}
        endereco={endereco}
        setNome={setNome}
        setFone={setFone}
        setEmail={setEmail}
        setEndereco={setEndereco}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default UpdateAluno;
