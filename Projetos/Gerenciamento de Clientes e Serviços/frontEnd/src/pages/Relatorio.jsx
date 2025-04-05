import { jsPDF } from "jspdf";
import React, { useState } from "react";
import {
  getRelatorioPagamentoDia,
  getRelatorioPagamentoMes,
  getRelatorioPagamentoSemana,
} from "../../api/api";

const Relatorio = () => {
  const [relatorioDia, setRelatorioDia] = useState(null);
  const [relatorioSemana, setRelatorioSemana] = useState(null);
  const [relatorioMes, setRelatorioMes] = useState(null);

  const handleRelatorioDia = async () => {
    const data = await getRelatorioPagamentoDia();

    console.log("Dados recebidos do backend:", data);

    setRelatorioDia(data);

    gerarPDF("Relatório de Pagamentos do Dia", {
      pagamentos: data.pagamentos,
      totalPago: parseFloat(data.totalPago),
    });
  };

  const handleRelatorioSemana = async () => {
    const data = await getRelatorioPagamentoSemana();

    console.log("Dados recebidos do backend:", data);

    setRelatorioSemana(data);

    gerarPDF("Relatório de Pagamentos da Semana", {
      pagamentos: data.pagamentos,
      totalPago: parseFloat(data.totalPago),
    });
  };

  const handleRelatorioMes = async () => {
    const data = await getRelatorioPagamentoMes();

    console.log("Dados recebidos do backend:", data);

    setRelatorioMes(data);

    gerarPDF("Relatório de Pagamentos do Mês", {
      pagamentos: data.pagamentos,
      totalPago: parseFloat(data.totalPago),
    });
  };

  const gerarPDF = (titulo, dados) => {
    if (!dados || !dados.pagamentos || !Array.isArray(dados.pagamentos)) {
      console.error("Os dados de pagamentos não são válidos:", dados);
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(titulo, 20, 20);

    doc.setFontSize(12);
    let y = 30;
    const pageHeight = doc.internal.pageSize.height;

    dados.pagamentos.forEach((pagamento, index) => {
      if (y + 40 > pageHeight) {
        doc.addPage();
        y = 20;
        doc.setFontSize(18);
        doc.text(titulo, 20, y);
        y += 10;
      }

      doc.setFontSize(12);
      doc.text(`Aluno: ${pagamento.aluno_nome}`, 20, y);
      doc.text(`Serviço: ${pagamento.servico_nome}`, 20, y + 10);
      doc.text(`Valor: ${pagamento.valor_pago}`, 20, y + 20);
      doc.text(
        `Data: ${new Date(pagamento.data_pagamento).toLocaleDateString()}`,
        20,
        y + 30
      );
      y += 40;
    });

    if (dados.totalPago !== undefined) {
      if (y + 20 > pageHeight) {
        doc.addPage();
        y = 20;
      }
      doc.text(`Total: ${dados.totalPago.toFixed(2)}`, 20, y + 10);
    }

    doc.save(`${titulo}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        Relatórios de Pagamento
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleRelatorioDia}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
        >
          Relatório de Pagamentos do Dia
        </button>

        <button
          onClick={handleRelatorioSemana}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
        >
          Relatório de Pagamentos da Semana
        </button>

        <button
          onClick={handleRelatorioMes}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
        >
          Relatório de Pagamentos do Mês
        </button>
      </div>
    </div>
  );
};

export default Relatorio;
