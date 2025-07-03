import { faSignature } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaCheck, FaEdit, FaHamburger, FaTimes, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ComboService } from "../../../server/api";
import type { Combo } from "../../../Type";

function ComboDelete({
  isOpen,
  onClose,
  onConfirm,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <h2 className="text-2xl text-center font-bold text-white border-b pb-2 mb-4">
                  Confirmar Exclusão
                </h2>
                {children}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-white hover:bg-gray-800 transition-colors duration-200 flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 flex-1"
                  >
                    Confirmar Exclusão
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper para card de produto com efeito hover
function ProdutoFotoHover({
  imagem,
  nome,
  alt,
}: {
  imagem: string;
  nome: string;
  alt: string;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className="relative flex flex-col items-center w-[64px] h-[64px] overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={imagem}
        alt={alt}
        className="w-16 h-16 object-cover rounded-full border-2 border-red-400 shadow transition-transform duration-300"
      />
      <span
        className={`absolute left-1/2 -translate-x-1/2 top-[72px] transition-all px-2 py-1 rounded shadow text-red-700 font-bold text-sm whitespace-nowrap z-20 border border-red-200 bg-white ${
          hovered
            ? "opacity-100 translate-y-2 delay-150"
            : "opacity-0 translate-y-0 delay-0"
        }`}
        style={{ pointerEvents: "none", minWidth: "max-content" }}
      >
        {nome}
      </span>
    </div>
  );
}

export default function ComboList() {
  const { data: combos, isError } = useQuery<Combo[]>({
    queryKey: ["combos-admin"],
    queryFn: ComboService.listarTodosCombosAdmin,
  });
  const [searchType, setSearchType] = useState<"nome" | "produto">("nome");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    comboId: number | null;
    comboName: string;
  }>({ isOpen: false, comboId: null, comboName: "" });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: ComboService.excluirCombo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combos-admin"] });
      setDeleteModal({ isOpen: false, comboId: null, comboName: "" });
    },
  });

  const filteredCombos = combos?.filter((combo) => {
    let matchesSearch = true;
    if (searchTerm.trim()) {
      if (searchType === "nome") {
        matchesSearch = combo.nome
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        matchesSearch =
          combo.produtoHamburguer?.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          combo.produtoBebida?.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          combo.produtoSobremesa?.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
      }
    }
    let matchesAtivo = combo.ativo === showOnlyActive;
    return matchesSearch && matchesAtivo;
  });

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        Erro ao carregar combos.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-screen-xl mx-auto px-4 py-32">
      <ComboDelete
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, comboId: null, comboName: "" })
        }
        onConfirm={() => {
          if (deleteModal.comboId) {
            deleteMutation.mutate(deleteModal.comboId);
          }
        }}
      >
        <p className="text-white text-lg">
          Tem certeza que deseja excluir o combo{" "}
          <span className="font-bold">"{deleteModal.comboName}"</span>?
        </p>
      </ComboDelete>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              searchType === "nome"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSearchType("nome")}
            title="Pesquisar por nome do combo"
          >
            <FontAwesomeIcon icon={faSignature} size="lg" />
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              searchType === "produto"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSearchType("produto")}
            title="Pesquisar por nome de produto"
          >
            <FaHamburger className="mr-1" />
          </button>
        </div>
        <input
          type="text"
          className="px-4 py-2 rounded-xl border-2 border-gray-200 shadow focus:border-red-600 focus:outline-none w-full md:w-80 text-lg bg-white/80 backdrop-blur transition-colors duration-200"
          placeholder={
            searchType === "nome"
              ? "Pesquisar por nome do combo"
              : "Pesquisar por nome de produto"
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center ml-4">
          <button
            type="button"
            className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none shadow-md border-2
              ${
                showOnlyActive
                  ? "bg-green-950 border-green-950"
                  : "bg-red-950 border-red-950"
              }`}
            onClick={() => setShowOnlyActive(!showOnlyActive)}
            title={showOnlyActive ? "Mostrar inativos" : "Mostrar ativos"}
          >
            <span
              className={`absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300
                ${showOnlyActive ? "translate-x-8" : "translate-x-0"}`}
            >
              {showOnlyActive ? (
                <FaCheck className="text-green-500" size={18} />
              ) : (
                <FaTimes className="text-red-500" size={18} />
              )}
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredCombos && filteredCombos.length > 0 ? (
          filteredCombos.map((combo) => (
            <motion.div
              key={combo.id}
              layout
              whileHover={{ scale: 1.035 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.4, 1] }}
              className="group"
            >
              <div
                className={`bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-red-500/60 max-w-xs w-full mx-auto p-0`}
                style={{ minHeight: "320px" }}
              >
                <h3 className="text-2xl font-bold text-red-700 text-center mb-2 tracking-tight pt-6">
                  {combo.nome}
                </h3>
                <div className="flex flex-row justify-center gap-8 mb-4">
                  <ProdutoFotoHover
                    imagem={combo.produtoHamburguer?.imagem}
                    nome={combo.produtoHamburguer?.nome}
                    alt={combo.produtoHamburguer?.nome}
                  />
                  <ProdutoFotoHover
                    imagem={combo.produtoBebida?.imagem}
                    nome={combo.produtoBebida?.nome}
                    alt={combo.produtoBebida?.nome}
                  />
                  <ProdutoFotoHover
                    imagem={combo.produtoSobremesa?.imagem}
                    nome={combo.produtoSobremesa?.nome}
                    alt={combo.produtoSobremesa?.nome}
                  />
                </div>
                <div className="flex flex-col items-center mt-8 mb-2">
                  <span className="text-xs font-semibold text-black uppercase mb-1 tracking-wider text-center">
                    Descrição
                  </span>
                  <p className="text-gray-700 text-center px-2 mt-1">
                    {combo.descricao}
                  </p>
                </div>
                <div className="flex flex-col items-center mt-4 mb-2">
                  <span className="text-xs font-semibold text-black uppercase mb-1 tracking-wider text-center">
                    Preço do Combo
                  </span>
                  <span className="text-2xl font-extrabold text-red-600 text-center mt-1">
                    R$ {combo.precoCombo.toFixed(2)}
                  </span>
                </div>
                <div className="flex space-x-4 justify-center pt-4 pb-6">
                  <button
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                    onClick={() => navigate(`/admin/combos/edit/${combo.id}`)}
                    title="Editar"
                  >
                    <FaEdit className="text-red-500" /> Editar
                  </button>
                  <button
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        comboId: combo.id,
                        comboName: combo.nome,
                      })
                    }
                    title="Excluir"
                  >
                    <FaTrash /> Excluir
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-12 text-lg">
            Nenhum combo encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
