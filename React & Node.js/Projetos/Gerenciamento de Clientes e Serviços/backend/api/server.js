import cors from "cors";
import express from "express";
import connection from "./connect.js";
const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("Clínica Fisio Bem-Estar");
});

//*Mostra alunos*\\
app.get("/alunos", (req, res) => {
  connection.query("SELECT * FROM Aluno", (err, results) => {
    if (err) {
      res.status(500).send("Erro ao buscar alunos");
    } else {
      res.json(results);
    }
  });
});

//*Informações dos alunos por id*\\
app.get("/alunos/:id", (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM Aluno WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send("Erro ao buscar aluno");
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send("Aluno não encontrado");
      }
    }
  });
});

//*Cadastra os Alunos*\\
app.post("/cadastro", (req, res) => {
  const { nome, fone, email, endereco } = req.body;
  const query =
    "INSERT INTO aluno (nome, fone, email, endereco) VALUES (?, ?, ?, ?)";

  connection.query(query, [nome, fone, email, endereco], (err, results) => {
    if (err) {
      res.status(500).send("Erro ao adicionar aluno");
    } else {
      res.status(201).send("aluno adicionado");
    }
  });
});

//*Vincula Alunos a Serviços*\\
app.post("/vinculo", (req, res) => {
  const { nome_aluno, nome_servico } = req.body;

  const query = `CALL vincular_servico_aluno(?, ?)`;

  connection.query(query, [nome_aluno, nome_servico], (err, results) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    return res.status(201).send("Serviço vinculado ao aluno com sucesso!");
  });
});

//*Edita informações dos Alunos*\\
app.put("/atualiza/:id", (req, res) => {
  const { id } = req.params;
  const { nome, fone, email, endereco } = req.body;

  const query =
    "UPDATE Aluno SET nome = ?, fone = ?, email = ?, endereco = ? WHERE id = ?";

  connection.query(query, [nome, fone, email, endereco, id], (err, results) => {
    if (err) {
      res.status(500).send("Erro ao atualizar aluno");
    } else {
      if (results.affectedRows > 0) {
        res.status(200).send("Aluno atualizado com sucesso");
      } else {
        res.status(404).send("Aluno não encontrado");
      }
    }
  });
});

//*Exclui os Alunos*\\
app.delete("/deletar/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM Aluno WHERE id = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send("Erro ao deletar aluno");
    } else {
      if (results.affectedRows > 0) {
        res.status(200).send("Aluno deletado com sucesso");
      } else {
        res.status(404).send("Aluno não encontrado");
      }
    }
  });
});

//*Lista os serviços*\\
app.get("/servicos", (req, res) => {
  connection.query("SELECT id, nome, preco FROM Servico", (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar serviços");
    }
    res.json(results);
  });
});

//*Lista os alunos de cada serviço*\\
app.get("/alunos/servico/:servico", (req, res) => {
  const servico = req.params.servico;

  connection.query(
    "SELECT * FROM AlunosPorServico WHERE servico_nome = ?",
    [servico],
    (err, results) => {
      if (err) {
        return res.status(500).send("Erro ao buscar alunos");
      }
      res.json(results);
    }
  );
});

//*Atualiza a data de vencimento e registra pagameneto*\\
app.put("/atualizar-pagamento", (req, res) => {
  const { alunoId, servicoId } = req.body;

  if (!alunoId || !servicoId) {
    return res.status(400).json({
      message: "ID do aluno e ID do serviço são necessários",
    });
  }

  const query = `CALL atualizar_pagamento_e_vinculo(?, ?)`;

  connection.query(query, [alunoId, servicoId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao atualizar pagamento e vencimento.",
        error: err,
      });
    }

    res.json({
      message:
        "Pagamento registrado e data de vencimento atualizada com sucesso!",
    });
  });
});

//*Pega o id do serviço*\\
app.get("/get-servico-id", (req, res) => {
  const { nome } = req.query;

  if (!nome) {
    return res.status(400).json({
      message: "O nome do serviço é necessário",
    });
  }

  const query = "SELECT id FROM Servico WHERE nome = ?";
  connection.query(query, [nome], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao buscar o ID do serviço",
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Serviço não encontrado",
      });
    }

    const servicoId = result[0].id;
    res.json({ servicoId });
  });
});

app.get("/aluno-servico", (req, res) => {
  const query = `SELECT * FROM AlunoServicoView;`;

  connection.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .send("Erro ao buscar os vínculos de alunos e serviços.");
    }
    res.json(results);
  });
});

//*Mostra os pagamentos*\\
app.get("/pagamentos", (req, res) => {
  const query = "SELECT * FROM PagamentosView";

  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Erro ao buscar pagamentos");
    } else {
      res.json(results);
    }
  });
});

// Exemplo para o Relatório de Pagamentos do Dia
app.get("/relatorio-pagamento-dia", (req, res) => {
  const query = "CALL relatorio_pagamento_dia();";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({
        message: "Erro ao gerar relatório de pagamentos do dia",
        error: err,
      });
    }
    const totalPago =
      results[1] && results[1][0] ? results[1][0].total_pago : 0;

    const pagamentosDia = {
      pagamentos: results[0],
      totalPago: totalPago,
    };

    res.json(pagamentosDia);
  });
});

//*Relatório de pagamentos da semana*\\
app.get("/relatorio-pagamento-semana", (req, res) => {
  const query = "CALL relatorio_pagamento_semana();";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({
        message: "Erro ao gerar relatório de pagamentos da semana",
        error: err,
      });
    }

    const totalPago =
      results[1] && results[1][0] ? results[1][0].total_pago : 0;

    const pagamentosSemana = {
      pagamentos: results[0],
      totalPago: totalPago,
    };

    res.json(pagamentosSemana);
  });
});

//*Relatório de pagamentos do mês*\\
app.get("/relatorio-pagamento-mes", (req, res) => {
  const query = "CALL relatorio_pagamento_mes();";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({
        message: "Erro ao gerar relatório de pagamentos do mês",
        error: err,
      });
    }

    const totalPago =
      results[1] && results[1][0] ? results[1][0].total_pago : 0;

    const pagamentosMes = {
      pagamentos: results[0],
      totalPago: totalPago,
    };

    res.json(pagamentosMes);
  });
});

app.post("/cadastro-servico", (req, res) => {
  const { nome, preco } = req.body;

  const query = "INSERT INTO Servico (nome, preco) VALUES (?, ?)";

  connection.query(query, [nome, preco], (err, results) => {
    if (err) {
      console.error("Erro SQL:", err);
      res.status(500).send("Erro ao adicionar serviço");
    } else {
      res.status(201).send("Serviço adicionado com sucesso");
    }
  });
});

// Atualiza informações de um serviço
app.put("/atualiza-servico/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;

  if (!nome || !preco) {
    return res.status(400).send("Nome e preço são obrigatórios");
  }

  const query = "UPDATE Servico SET nome = ?, preco = ? WHERE id = ?";
  connection.query(query, [nome, preco, id], (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao atualizar serviço");
    } else {
      if (results.affectedRows > 0) {
        return res.status(200).send("Serviço atualizado com sucesso");
      } else {
        return res.status(404).send("Serviço não encontrado");
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
