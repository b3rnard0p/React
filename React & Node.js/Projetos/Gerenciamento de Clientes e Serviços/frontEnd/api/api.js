import axios from "axios";

const URL = "http://localhost:3000";

// Função para buscar todos os alunos
export const getAlunos = async () => {
  try {
    const response = await axios.get(`${URL}/alunos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return [];
  }
};

// Função para buscar aluno por ID
export const getAlunoById = async (id) => {
  try {
    const response = await axios.get(`${URL}/alunos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar aluno com ID ${id}:`, error);
    return null;
  }
};

// Função para buscar todos os serviços
export const getServicos = async () => {
  try {
    const response = await axios.get(`${URL}/servicos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  }
};

// Função para buscar alunos por serviço
export const getAlunosByServico = async (servico) => {
  try {
    const response = await axios.get(`${URL}/alunos/servico/${servico}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar alunos de ${servico}:`, error);
    return [];
  }
};

// Função para cadastrar um aluno
export const cadastrarAluno = async (alunoData) => {
  try {
    const response = await axios.post(`${URL}/cadastro`, alunoData);
    return response;
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    throw error;
  }
};

// Função para vincular um serviço ao aluno
export const vincularServico = async (vinculoData) => {
  try {
    const response = await axios.post(`${URL}/vinculo`, vinculoData);
    return response;
  } catch (error) {
    console.error("Erro ao vincular serviço ao aluno:", error);
    throw error;
  }
};

// Função para atualizar aluno
export const atualizarAluno = async (id, alunoData) => {
  try {
    const response = await axios.put(`${URL}/atualiza/${id}`, alunoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar aluno com ID ${id}:`, error);
    throw error;
  }
};

// Função para deletar aluno por ID
export const deleteAluno = async (id) => {
  try {
    const response = await axios.delete(`${URL}/deletar/${id}`);
    return response;
  } catch (error) {
    console.error(`Erro ao deletar aluno com ID ${id}:`, error);
    throw error;
  }
};

// Função para atualizar e registrar o pagamento
export const atualizarPagamento = async (alunoId, servicoId) => {
  try {
    console.log("Enviando para o backend:", alunoId, servicoId);
    const response = await axios.put(`${URL}/atualizar-pagamento`, {
      alunoId,
      servicoId,
    });
    return response.data;
  } catch (error) {
    throw new Error("Erro ao atualizar o pagamento: " + error.message);
  }
};

// Função para buscar o ID do serviço pelo nome
export const buscarServicoId = async (nomeServico) => {
  try {
    const response = await axios.get(`${URL}/get-servico-id`, {
      params: { nome: nomeServico },
    });
    return response.data.servicoId;
  } catch (error) {
    console.error("Erro ao buscar o ID do serviço:", error);
    return null;
  }
};

// Função para buscar todos os vínculos entre alunos e serviços
export const getAlunoServico = async () => {
  try {
    const response = await axios.get(`${URL}/aluno-servico`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os vínculos de alunos e serviços:", error);
    return [];
  }
};

// Função para buscar todos os pagamentos
export const getPagamentos = async () => {
  try {
    const response = await axios.get(`${URL}/pagamentos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    return [];
  }
};

// Função para buscar o relatório de pagamentos do dia
export const getRelatorioPagamentoDia = async () => {
  try {
    const response = await axios.get(`${URL}/relatorio-pagamento-dia`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório de pagamentos do dia:", error);
    return null;
  }
};

// Função para buscar o relatório de pagamentos da semana
export const getRelatorioPagamentoSemana = async () => {
  try {
    const response = await axios.get(`${URL}/relatorio-pagamento-semana`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório de pagamentos da semana:", error);
    return null;
  }
};

// Função para buscar o relatório de pagamentos do mês
export const getRelatorioPagamentoMes = async () => {
  try {
    const response = await axios.get(`${URL}/relatorio-pagamento-mes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório de pagamentos do mês:", error);
    return null;
  }
};

//Função para cadastrar serviço
export const cadastrarServico = async (servicoData) => {
  try {
    const response = await axios.post(`${URL}/cadastro-servico`, servicoData);
    return response;
  } catch (error) {
    console.error("Erro ao cadastrar serviço:", error);
    throw error;
  }
};

// Função para atualizar serviço
export const atualizarServico = async (id, servicoData) => {
  try {
    const response = await axios.put(
      `${URL}/atualiza-servico/${id}`,
      servicoData
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar serviço com ID ${id}:`, error);
    throw error;
  }
};
