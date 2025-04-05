import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteAluno } from "../../api/api";

const DeleteAluno = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    deleteAluno(id)
      .then((response) => {
        alert("Aluno deletado com sucesso!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Erro ao deletar aluno", error);
        alert("Erro ao deletar aluno");
      });
  };

  return (
    <div>
      <h2>Deseja realmente excluir este aluno?</h2>
      <button onClick={handleDelete}>Sim, excluir</button>
    </div>
  );
};

export default DeleteAluno;
