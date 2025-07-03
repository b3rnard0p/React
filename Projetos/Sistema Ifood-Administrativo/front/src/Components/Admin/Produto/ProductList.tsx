// src/components/ProductList.tsx
import { faSignature } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaCheck, FaEdit, FaTag, FaTimes, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ProdutoService } from "../../../server/api";
import "../../../Style.css";
import type { Produto } from "../../../Type";
import { ProductDelete } from "./ProductDelete";

// Função utilitária para dividir em 4 colunas fixas
function splitIntoColumns<T>(arr: T[], numCols: number): T[][] {
  const cols: T[][] = Array.from({ length: numCols }, () => []);
  arr.forEach((item, idx) => {
    cols[idx % numCols].push(item);
  });
  return cols;
}

export default function ProductList() {
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null as number | null,
    productName: "",
  });

  const [clickedProductId, setClickedProductId] = useState<number | null>(null);

  // Pesquisa
  const [searchType, setSearchType] = useState<"nome" | "categoria">("nome");
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(true); // true = só disponíveis, false = só indisponíveis

  const toggleProductExpansion = (productId: number) => {
    setClickedProductId((prev) => (prev === productId ? null : productId));
  };

  const deleteMutation = useMutation({
    mutationFn: ProdutoService.excluirProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      setDeleteModal({ isOpen: false, productId: null, productName: "" });
      setClickedProductId(null);
    },
  });

  const { data, isError } = useQuery<Produto[]>({
    queryKey: ["produtos"],
    queryFn: ProdutoService.listarProdutos,
  });

  const navigate = useNavigate();

  // Filtragem
  const filteredData = data?.filter((produto) => {
    let matchesSearch = true;
    if (searchTerm.trim()) {
      if (searchType === "nome") {
        matchesSearch = produto.nome
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        matchesSearch =
          produto.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false;
      }
    }
    let matchesDisponibilidade = produto.disponibilidade === showOnlyAvailable;
    return matchesSearch && matchesDisponibilidade;
  });

  const numCols = 4;
  const columns = filteredData ? splitIntoColumns(filteredData, numCols) : [];

  if (isError) {
    return <p>Erro ao carregar produtos</p>;
  }

  return (
    <div className="relative w-full max-w-screen-xl mx-auto px-4 py-32">
      <ProductDelete
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, productId: null, productName: "" })
        }
        onConfirm={() => {
          if (deleteModal.productId) {
            deleteMutation.mutate(deleteModal.productId);
          }
        }}
      >
        <p className="text-white">
          Tem certeza que deseja excluir o produto{" "}
          <span className="font-bold">"{deleteModal.productName}"</span>?
        </p>
      </ProductDelete>

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
              searchType === "categoria"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSearchType("categoria")}
            title="Pesquisar por categoria"
          >
            <FaTag size={16} />
          </button>
        </div>
        <input
          type="text"
          className="px-4 py-2 rounded-xl border-2 border-gray-200 shadow focus:border-red-600 focus:outline-none w-full md:w-80 text-lg bg-white/80 backdrop-blur transition-colors duration-200"
          placeholder={`Pesquisar por ${
            searchType === "nome" ? "nome" : "categoria"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearching((s) => !s);
          }}
        />
        {/* Switch de disponibilidade moderno (apenas o toggle) */}
        <div className="flex items-center ml-4">
          <button
            type="button"
            className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none shadow-md border-2
              ${
                showOnlyAvailable
                  ? "bg-green-950 border-green-950"
                  : "bg-red-950 border-red-950"
              }`}
            onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
            title={
              showOnlyAvailable
                ? "Mostrar indisponíveis"
                : "Mostrar disponíveis"
            }
          >
            <span
              className={`absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300
                ${showOnlyAvailable ? "translate-x-8" : "translate-x-0"}`}
            >
              {showOnlyAvailable ? (
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
            {col.map((produto) => {
              const isExpanded = clickedProductId === produto.id;
              return (
                <div key={produto.id}>
                  {/* Wrapper externo para animar apenas o scale no hover */}
                  <motion.div
                    layout
                    whileHover={{ scale: 1.035 }}
                    transition={{ duration: 0.2, ease: [0.2, 0.8, 0.4, 1] }}
                    style={{ minHeight: "320px" }}
                    className="group"
                  >
                    {/* Wrapper interno para o card, sem animar height */}
                    <div
                      className={`bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                        isExpanded
                          ? "shadow-red-500/60 shadow-lg"
                          : "shadow-lg hover:shadow-red-500/60"
                      }`}
                      onClick={() => toggleProductExpansion(produto.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Imagem */}
                      <div className="w-full h-48 relative overflow-hidden border-b-2 border-red-200 flex-shrink-0">
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/300x300?text=Imagem+Não+Disponível";
                            target.className =
                              "w-full h-full object-contain bg-gray-100 p-4";
                          }}
                        />
                        {!produto.disponibilidade && (
                          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow font-bold">
                            Indisponível
                          </span>
                        )}
                      </div>

                      {/* Conteúdo principal */}
                      <div className="flex flex-col flex-grow p-5 overflow-hidden">
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
                          {produto.nome}
                        </h2>

                        {/* Animação de expansão apenas no conteúdo extra */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ maxHeight: 0, opacity: 0 }}
                              animate={{ maxHeight: 2000, opacity: 1 }}
                              exit={{
                                maxHeight: 0,
                                opacity: 0,
                                transition: {
                                  maxHeight: {
                                    duration: 0.7,
                                    ease: "easeInOut",
                                  },
                                  opacity: { duration: 0.7, ease: "easeInOut" },
                                },
                              }}
                              transition={{
                                maxHeight: { duration: 1.2, ease: "easeInOut" },
                                opacity: { duration: 0.5, ease: "easeInOut" },
                              }}
                              style={{ overflow: "hidden" }}
                            >
                              <div className="space-y-4 text-gray-700">
                                <div>
                                  <p className="font-medium text-gray-500 mb-1 text-center uppercase tracking-wide">
                                    Descrição
                                  </p>
                                  <p className="text-gray-700 text-center text-base">
                                    {produto.descricao}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500 mb-1 text-center uppercase tracking-wide">
                                    Categoria
                                  </p>
                                  <p className="text-gray-700 text-center text-base">
                                    {produto.categoria}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500 mb-1 text-center uppercase tracking-wide">
                                    Preço
                                  </p>
                                  <p className="text-red-600 font-bold text-2xl text-center">
                                    R$ {produto.preco.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.div
                          className="mt-auto pt-6"
                          initial={false}
                          animate={{
                            y: isExpanded ? 0 : -15,
                            opacity: 1,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.2, 0.8, 0.4, 1],
                          }}
                        >
                          <div className="flex space-x-4 justify-center">
                            <button
                              className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/edit/${produto.id}`);
                              }}
                              title="Editar"
                            >
                              <FaEdit className="text-red-500" /> Editar
                            </button>
                            <button
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => {
                                e.stopPropagation();
                                setDeleteModal({
                                  isOpen: true,
                                  productId: produto.id,
                                  productName: produto.nome,
                                });
                              }}
                              title="Excluir"
                            >
                              <FaTrash /> Excluir
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
