import React, { useEffect, useState } from "react";
import {
  FaBreadSlice,
  FaCheese,
  FaDollarSign,
  FaDrumstickBite,
  FaLeaf,
  FaPepperHot,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";
import { GiSausage } from "react-icons/gi";
import { api } from "../../server/api";
import { FloatingInput } from "../Admin/Produto/ProductForm";
import { useCart } from "./Context";
import { useUser } from "./UserContext";

interface Ingrediente {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}

interface CustomBurger {
  id: number;
  ingredientes: Ingrediente[];
  preco: number;
}

const CustomBurgerBuilder: React.FC = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [selectedIngredientes, setSelectedIngredientes] = useState<
    Ingrediente[]
  >([]);
  const [creating, setCreating] = useState(false);
  const { addToCart } = useCart();
  const { user } = useUser();
  const [openCategoria, setOpenCategoria] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [animatingCategoria, setAnimatingCategoria] = useState<string | null>(
    null
  );

  // Mapeamento dos tipos para ícones
  const tipoIcone: Record<string, React.ReactNode> = {
    pão: <FaBreadSlice className="text-yellow-700" />,
    carne: <FaDrumstickBite className="text-red-700" />,
    queijo: <FaCheese className="text-yellow-500" />,
    molho: <GiSausage className="text-orange-500" />,
    vegetal: <FaLeaf className="text-green-600" />,
    tempero: <FaPepperHot className="text-red-500" />,
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  useEffect(() => {
    if (!openCategoria) setSearchTerm("");
  }, [openCategoria]);

  const fetchIngredientes = async () => {
    try {
      const response = await api.get("/api/cliente/ingredientes");
      setIngredientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar ingredientes:", error);
    }
  };

  const toggleIngrediente = (ingrediente: Ingrediente) => {
    setSelectedIngredientes((prev) => {
      const isSelected = prev.some((i) => i.id === ingrediente.id);
      if (isSelected) {
        return prev.filter((i) => i.id !== ingrediente.id);
      } else {
        return [...prev, ingrediente];
      }
    });
  };

  const calcularPreco = () => {
    return selectedIngredientes.reduce(
      (total, ingrediente) => total + ingrediente.preco,
      0
    );
  };

  const handleCreateBurger = async () => {
    if (selectedIngredientes.length === 0) {
      return;
    }

    if (!user) {
      return;
    }

    setCreating(true);
    try {
      const ingredientesIds = selectedIngredientes.map((i) => i.id);
      const response = await api.post(`/api/cliente/custom-burgers`, {
        usuarioId: user.id,
        ingredientesIds,
      });

      const customBurger: CustomBurger = {
        id: response.data.id,
        ingredientes: selectedIngredientes,
        preco: calcularPreco(),
      };

      // Adicionar ao carrinho como um item único
      addToCart({
        id: `custom-${customBurger.id}`,
        nome: "Hambúrguer Personalizado",
        preco: customBurger.preco,
        quantidade: 1,
        tipo: "custom-burger",
        customBurgerId: customBurger.id,
        ingredientes: customBurger.ingredientes,
      });

      setSelectedIngredientes([]);
    } catch (error: any) {
      if (error.response?.status === 409) {
      } else {
      }
    } finally {
      setCreating(false);
    }
  };

  const getIngredientesPorTipo = (tipo: string) => {
    return ingredientes.filter(
      (i) => i.tipo === tipo && i.ativo && i.estoque > 0
    );
  };

  const tiposIngredientes = [
    "carne",
    "pão",
    "queijo",
    "molho",
    "vegetal",
    "tempero",
  ];

  // Função para abrir/fechar com animação
  const handleToggleCategoria = (tipo: string) => {
    if (openCategoria === tipo) {
      setAnimatingCategoria(tipo);
      setTimeout(() => {
        setOpenCategoria(null);
        setAnimatingCategoria(null);
      }, 300); // duração da animação
    } else {
      setOpenCategoria(tipo);
      setAnimatingCategoria(null);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Setinha de voltar para o Home, igual ao Cart */}
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-white hover:text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </a>
          <div className="w-6"></div>
        </div>
        {/* Layout para desktop - mantido como original */}
        <div className="hidden md:flex flex-col gap-8 items-start relative md:flex-row">
          {/* Conteúdo principal */}
          <div className="flex-1 w-full">
            {/* Card de tipos de ingredientes em linha horizontal */}
            <div className="mb-2">
              <div className="bg-white/60 rounded-xl border border-gray-200 p-3 shadow-sm">
                <div className="grid grid-cols-6 gap-2">
                  {tiposIngredientes.map((tipo) => {
                    const isOpen = openCategoria === tipo;
                    return (
                      <button
                        key={tipo}
                        onClick={() => handleToggleCategoria(tipo)}
                        className="flex items-center justify-between w-full min-w-[90px] px-2 py-2 rounded-lg border-2 border-gray-200 text-gray-800 font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 hover:bg-red-50/80 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                      >
                        <span className="flex items-center gap-1 capitalize truncate">
                          {tipoIcone[tipo]}
                          {tipo === "pão"
                            ? "Pães"
                            : tipo === "carne"
                            ? "Carnes"
                            : tipo === "queijo"
                            ? "Queijos"
                            : tipo === "molho"
                            ? "Molhos"
                            : tipo === "vegetal"
                            ? "Vegetais"
                            : "Temperos"}
                        </span>
                        <span
                          className="ml-1 inline-block"
                          style={{ width: 20, height: 20 }}
                        >
                          <FaPlus
                            style={{
                              transition:
                                "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                              transform: isOpen
                                ? "rotate(45deg)"
                                : "rotate(0deg)",
                              display: "block",
                            }}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card de ingredientes */}
            {(openCategoria || animatingCategoria) && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openCategoria || animatingCategoria
                    ? "max-h-[600px] opacity-100 mt-3 mb-1"
                    : "max-h-0 opacity-0"
                } bg-white/90 rounded-xl border border-gray-200 p-6 shadow-lg w-full`}
                style={{
                  pointerEvents:
                    openCategoria || animatingCategoria ? "auto" : "none",
                }}
              >
                <div className="w-56 mx-auto mb-2">
                  <FloatingInput
                    id="search-ingrediente"
                    label="Pesquisar ingrediente"
                    placeholder=" "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus={false}
                    readOnly={false}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    getIngredientesPorTipo(
                      openCategoria || animatingCategoria || ""
                    ) || []
                  )
                    .filter((ingrediente) =>
                      ingrediente.nome
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((ingrediente) => {
                      const isSelected = selectedIngredientes.some(
                        (i) => i.id === ingrediente.id
                      );
                      return (
                        <button
                          key={ingrediente.id}
                          onClick={() => toggleIngrediente(ingrediente)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium bg-white/80 focus:outline-none focus:ring-2 focus:ring-red-400/40 backdrop-blur-md
                            shadow-md ${
                              isSelected
                                ? "border-red-500 text-red-700 bg-red-100/80 shadow-[0_0_16px_4px_rgba(239,68,68,0.4)]"
                                : "border-gray-200 text-gray-800 hover:shadow-[0_0_16px_4px_rgba(239,68,68,0.4)]"
                            }
                          `}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="truncate">{ingrediente.nome}</span>
                            <span className="font-bold text-red-600">
                              R$ {ingrediente.preco.toFixed(2)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Card "Seu Hambúrguer" fixo à direita no desktop */}
          <div className="w-80 flex-shrink-0 mt-0 md:mt-0 md:sticky md:top-0">
            <div className="rounded-2xl border border-gray-200 bg-white/40 backdrop-blur-md shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-red-600 mb-6 flex items-center gap-2">
                <FaDollarSign className="text-green-500" />
                Seu Hambúrguer
              </h2>
              {selectedIngredientes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum ingrediente selecionado</p>
                  <p className="text-sm mt-2">
                    Escolha os ingredientes ao lado
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-gray-700">
                      Ingredientes selecionados:
                    </h3>
                    {selectedIngredientes.map((ingrediente) => (
                      <div
                        key={ingrediente.id}
                        className="flex justify-between items-center p-2 bg-white/70 rounded"
                      >
                        <span className="text-sm">{ingrediente.nome}</span>
                        <span className="text-sm font-semibold text-green-600">
                          R$ {ingrediente.preco.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        R$ {calcularPreco().toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateBurger}
                    disabled={creating || selectedIngredientes.length === 0}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <FaShoppingCart />
                    {creating ? "Criando..." : "Adicionar ao Carrinho"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Layout para mobile - como você pediu */}
        <div className="md:hidden flex flex-col gap-4">
          {/* Card de categorias empilhadas no mobile */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4 shadow-lg">
            <div className="grid grid-cols-1 gap-2">
              {tiposIngredientes.map((tipo) => {
                const isOpen = openCategoria === tipo;
                return (
                  <div key={tipo} className="mb-2">
                    <button
                      onClick={() => handleToggleCategoria(tipo)}
                      className="flex items-center justify-between w-full min-w-[90px] px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-800 font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 hover:bg-red-50/80 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                    >
                      <span className="flex items-center gap-2 capitalize truncate">
                        {tipoIcone[tipo]}
                        {tipo === "pão"
                          ? "Pães"
                          : tipo === "carne"
                          ? "Carnes"
                          : tipo === "queijo"
                          ? "Queijos"
                          : tipo === "molho"
                          ? "Molhos"
                          : tipo === "vegetal"
                          ? "Vegetais"
                          : "Temperos"}
                      </span>
                      <span
                        className="ml-1 inline-block"
                        style={{ width: 20, height: 20 }}
                      >
                        <FaPlus
                          style={{
                            transition:
                              "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                            transform: isOpen
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                            display: "block",
                          }}
                        />
                      </span>
                    </button>

                    {/* Ingredientes da categoria aberta no mobile */}
                    {isOpen && (
                      <div className="mt-2 mx-2">
                        <div className="mb-3">
                          <FloatingInput
                            id={`search-${tipo}`}
                            label="Pesquisar ingrediente"
                            placeholder=" "
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus={false}
                            readOnly={false}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {getIngredientesPorTipo(tipo)
                            .filter((ingrediente) =>
                              ingrediente.nome
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            )
                            .map((ingrediente) => {
                              const isSelected = selectedIngredientes.some(
                                (i) => i.id === ingrediente.id
                              );
                              return (
                                <button
                                  key={ingrediente.id}
                                  onClick={() => toggleIngrediente(ingrediente)}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left font-medium bg-white/80 focus:outline-none focus:ring-2 focus:ring-red-400/40
                                    ${
                                      isSelected
                                        ? "border-red-500 text-red-700 bg-red-100/80"
                                        : "border-gray-200 text-gray-800"
                                    }
                                  `}
                                >
                                  <div className="flex justify-between items-center">
                                    <span>{ingrediente.nome}</span>
                                    <span className="font-bold text-red-600">
                                      R$ {ingrediente.preco.toFixed(2)}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card "Seu Hambúrguer" abaixo no mobile */}
          <div className="rounded-2xl border border-gray-200 bg-white/40 backdrop-blur-md shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-red-600 mb-6 flex items-center gap-2">
              <FaDollarSign className="text-green-500" />
              Seu Hambúrguer
            </h2>
            {selectedIngredientes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum ingrediente selecionado</p>
                <p className="text-sm mt-2">Escolha os ingredientes acima</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-gray-700">
                    Ingredientes selecionados:
                  </h3>
                  {selectedIngredientes.map((ingrediente) => (
                    <div
                      key={ingrediente.id}
                      className="flex justify-between items-center p-2 bg-white/70 rounded"
                    >
                      <span className="text-sm">{ingrediente.nome}</span>
                      <span className="text-sm font-semibold text-green-600">
                        R$ {ingrediente.preco.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      R$ {calcularPreco().toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCreateBurger}
                  disabled={creating || selectedIngredientes.length === 0}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <FaShoppingCart />
                  {creating ? "Criando..." : "Adicionar ao Carrinho"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomBurgerBuilder;
