import { faSignature } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaBreadSlice,
  FaCarrot,
  FaCheck,
  FaCheese,
  FaDrumstickBite,
  FaEdit,
  FaEllipsisH,
  FaLeaf,
  FaPepperHot,
  FaTimes,
  FaTrash,
  FaWineBottle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api, IngredienteService } from "../../../server/api";
import "../../../Style.css";

interface Ingrediente {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}

// Função utilitária para dividir em 4 colunas fixas
function splitIntoColumns<T>(arr: T[], numCols: number): T[][] {
  const cols: T[][] = Array.from({ length: numCols }, () => []);
  arr.forEach((item, idx) => {
    cols[idx % numCols].push(item);
  });
  return cols;
}

function IngredienteDelete({
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

// Função para retornar o ícone correto do tipo
function getTipoIcon(tipo: string) {
  switch (tipo) {
    case "carne":
      return <FaDrumstickBite className="text-red-600" size={20} />;
    case "pão":
      return <FaBreadSlice className="text-red-600" size={20} />;
    case "queijo":
      return <FaCheese className="text-red-600" size={20} />;
    case "molho":
      return <FaWineBottle className="text-red-600" size={20} />;
    case "vegetal":
      return <FaCarrot className="text-red-600" size={20} />;
    case "tempero":
      return <FaPepperHot className="text-red-600" size={20} />;
    case "outro":
      return <FaEllipsisH className="text-red-600" size={20} />;
    default:
      return <FaLeaf className="text-red-600" size={20} />;
  }
}

const IngredienteList: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    ingredienteId: null as number | null,
    ingredienteName: "",
  });

  const [clickedIngredienteId, setClickedIngredienteId] = useState<
    number | null
  >(null);

  // Pesquisa
  const [searchType, setSearchType] = useState<"nome" | "tipo">("nome");
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(true);

  const toggleIngredienteExpansion = (ingredienteId: number) => {
    setClickedIngredienteId((prev) =>
      prev === ingredienteId ? null : ingredienteId
    );
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/admin/ingredientes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes-admin"] });
    },
  });

  const { data: ingredientes, isError } = useQuery<Ingrediente[]>({
    queryKey: ["ingredientes-admin"],
    queryFn: IngredienteService.listarIngredientesAdmin,
  });

  // Filtragem
  const filteredData = ingredientes?.filter((ingrediente) => {
    let matchesSearch = true;
    if (searchTerm.trim()) {
      if (searchType === "nome") {
        matchesSearch = ingrediente.nome
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        matchesSearch = ingrediente.tipo
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    }
    let matchesAtivo = ingrediente.ativo === showOnlyActive;
    return matchesSearch && matchesAtivo;
  });

  const numCols = 4;
  const columns = filteredData ? splitIntoColumns(filteredData, numCols) : [];

  return (
    <div className="relative w-full max-w-screen-xl mx-auto px-4 py-32">
      <IngredienteDelete
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            ingredienteId: null,
            ingredienteName: "",
          })
        }
        onConfirm={() => {
          if (deleteModal.ingredienteId) {
            deleteMutation.mutate(deleteModal.ingredienteId);
          }
        }}
      >
        <p className="text-white text-lg">
          Tem certeza que deseja excluir o ingrediente{" "}
          <span className="font-bold">"{deleteModal.ingredienteName}"</span>?
        </p>
      </IngredienteDelete>

      {/* Barra de pesquisa */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              searchType === "nome"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSearchType("nome")}
            title="Pesquisar por nome"
          >
            <FontAwesomeIcon icon={faSignature} size="lg" />
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              searchType === "tipo"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSearchType("tipo")}
            title="Pesquisar por tipo"
          >
            <FaLeaf size={16} />
          </button>
        </div>
        <input
          type="text"
          className="px-4 py-2 rounded-xl border-2 border-gray-200 shadow focus:border-red-600 focus:outline-none w-full md:w-80 text-lg bg-white/80 backdrop-blur transition-colors duration-200"
          placeholder={`Pesquisar por ${
            searchType === "nome" ? "nome" : "tipo"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearching((s) => !s);
          }}
        />
        {/* Switch de ativo/inativo moderno */}
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

      <div className="colunas">
        {columns.map((col, colIdx) => (
          <div className="coluna" key={colIdx}>
            {col.map((ingrediente) => (
              <div key={ingrediente.id}>
                <div
                  className="bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-80 shadow-lg hover:shadow-red-500/60 group"
                  style={{ cursor: "pointer" }}
                >
                  {/* Header do card */}
                  <div className="relative p-6 pb-2 flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          {getTipoIcon(ingrediente.tipo)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-lg text-gray-800 leading-tight break-words line-clamp-2 max-h-[2.6em]">
                            {ingrediente.nome}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize truncate">
                            {ingrediente.tipo}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="mb-2">
                      <p className="text-2xl font-bold text-red-600">
                        R$ {ingrediente.preco.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">Preço unitário</p>
                    </div>

                    {/* Estoque */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Estoque</span>
                        <span className="font-bold text-gray-800">
                          {ingrediente.estoque} unidades
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            ingrediente.estoque > 20
                              ? "bg-green-900"
                              : ingrediente.estoque > 10
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (ingrediente.estoque / 100) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Botões sempre visíveis na base do card */}
                  <div className="flex gap-2 px-6 pb-6 mt-auto justify-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/ingredientes/editar/${ingrediente.id}`)
                      }
                      className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                      title="Editar"
                    >
                      <FaEdit className="text-red-500" /> Editar
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          ingredienteId: ingrediente.id,
                          ingredienteName: ingrediente.nome,
                        })
                      }
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                      title="Excluir"
                    >
                      <FaTrash /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {filteredData?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Nenhum ingrediente encontrado.
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredienteList;
