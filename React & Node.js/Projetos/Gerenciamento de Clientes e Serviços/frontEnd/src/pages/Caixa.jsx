import React, { useEffect, useState } from "react";
import { getPagamentos } from "../../api/api.js";
import CaixaInfo from "../components/CaixaInfo.jsx";

const Caixa = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [dataPesquisa, setDataPesquisa] = useState("");
  const [pagamentosFiltrados, setPagamentosFiltrados] = useState([]);

  const fetchPagamentos = async () => {
    const dadosPagamentos = await getPagamentos();
    setPagamentos(dadosPagamentos);
  };

  const filtrarPagamentos = () => {
    if (dataPesquisa === "") {
      setPagamentosFiltrados(pagamentos);
    } else {
      const dataPesquisaFormatada = new Date(dataPesquisa)
        .toISOString()
        .split("T")[0];

      const filtrados = pagamentos.filter((pagamento) => {
        const dataPagamento = new Date(pagamento.data_pagamento)
          .toISOString()
          .split("T")[0];
        return dataPagamento === dataPesquisaFormatada;
      });

      setPagamentosFiltrados(filtrados);
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  useEffect(() => {
    filtrarPagamentos();
  }, [dataPesquisa, pagamentos]);

  return (
    <CaixaInfo
      dataPesquisa={dataPesquisa}
      setDataPesquisa={setDataPesquisa}
      filtrarPagamentos={filtrarPagamentos}
      pagamentosFiltrados={pagamentosFiltrados}
    />
  );
};

export default Caixa;
