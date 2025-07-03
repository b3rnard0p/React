import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { FaGlassMartiniAlt, FaHamburger, FaIceCream } from "react-icons/fa";
import { ProdutoService } from "../../server/api.ts";
import "../../Style.css";
import type { Produto } from "../../Type.ts";
import Footer from "../Base/Footer.tsx";
import { useCart } from "./Context";

type Combo = {
  id: number;
  nome: string;
  descricao: string;
  produtoHamburguer: Produto;
  produtoBebida: Produto;
  produtoSobremesa: Produto;
  precoCombo: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
};

export function UserProducts() {
  const { addToCart } = useCart();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [rotation, setRotation] = useState(0);
  const autoRotateInterval = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    fetch("http://localhost:8080/api/cliente/combos/ativos")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCombos(data));
  }, []);

  const { data, error } = useQuery<Produto[]>({
    queryKey: ["produtos"],
    queryFn: ProdutoService.listarProdutos,
  });

  // Efeito para o carrossel automático
  useEffect(() => {
    if (combos.length > 0) {
      autoRotateInterval.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % combos.length);
      }, 5000);
    }
    return () => {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }
    };
  }, [combos.length]);

  // Funções para controle do carrossel com mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (autoRotateInterval.current) {
      clearInterval(autoRotateInterval.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setRotation(deltaX);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Determinar a direção do arrasto e mudar o índice conforme necessário
      if (rotation > 50 && combos.length > 0) {
        setCurrentIndex((prev) => (prev - 1 + combos.length) % combos.length);
      } else if (rotation < -50 && combos.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % combos.length);
      }
      setRotation(0);

      // Reiniciar o auto-rotate após interação
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }
      autoRotateInterval.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % combos.length);
      }, 5000);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setRotation(0);
    }
  };

  const getCardStyle = (index: number) => {
    const total = combos.length;
    const pos = index - currentIndex;
    // Para carrossel circular
    const half = Math.floor(total / 2);
    let realPos = pos;
    if (pos > half) realPos = pos - total;
    if (pos < -half) realPos = pos + total;

    // Parâmetros visuais
    const baseTranslate = 180; // distância horizontal
    const baseScale = 0.7; // escala dos laterais
    const baseRotate = 18; // rotação Y dos laterais
    const blur = Math.abs(realPos) === 1 ? "blur(1px)" : "blur(2px)";

    if (realPos === 0) {
      // Card central
      return {
        transform: `translateX(0px) scale(1) rotateY(0deg)`,
        zIndex: 10,
        opacity: 1,
        filter: "none",
        transition: isDragging ? "none" : "transform 0.5s, opacity 0.5s",
      };
    } else if (Math.abs(realPos) === 1) {
      // Laterais próximos
      return {
        transform: `translateX(${
          realPos * baseTranslate
        }px) scale(${baseScale}) rotateY(${-realPos * baseRotate}deg)`,
        zIndex: 5,
        opacity: 0.7,
        filter: blur,
        transition: isDragging ? "none" : "transform 0.5s, opacity 0.5s",
      };
    } else {
      // Demais (mais ao fundo) - esconder combos distantes
      return {
        transform: `translateX(${
          realPos * baseTranslate * 1.5
        }px) scale(0.5) rotateY(${-realPos * baseRotate * 2}deg)`,
        zIndex: 1,
        opacity: 0,
        pointerEvents: "none",
        filter: "blur(2px)",
        transition: isDragging ? "none" : "transform 0.5s, opacity 0.5s",
      };
    }
  };

  const produtosPorCategoria = data
    ?.filter((produto) => produto.disponibilidade)
    .reduce((acc, produto) => {
      const categoria = produto.categoria || "Sem Categoria";
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(produto);
      return acc;
    }, {} as Record<string, Produto[]>);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-48">
        <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-700">
          <p className="text-red-400 text-lg">
            Erro ao carregar produtos: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!produtosPorCategoria || Object.keys(produtosPorCategoria).length === 0) {
    return (
      <div className="container mx-auto px-4 py-48">
        <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-400 text-lg">
            Nenhum produto disponível no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-24 flex-grow">
        {/* Seção de destaque Monte seu Hambúrguer */}
        <section className="w-full flex flex-col items-center justify-center mb-16">
          <div className="flex flex-col items-center justify-center mt-2 mb-8">
            <div className="relative w-full h-[90px] mb-2">
              <FaHamburger
                className="text-red-500 text-[80px] md:text-[110px] drop-shadow-2xl absolute left-0 top-0 animate-burger-slide"
                style={{ zIndex: 2 }}
              />
            </div>
            <h1
              className="text-5xl md:text-7xl font-extrabold mb-4 text-center text-black drop-shadow-lg"
              style={{
                fontFamily: "'Fredoka', 'Poppins', 'Inter', Arial, sans-serif",
              }}
            >
              Monte seu Hambúrguer
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 font-medium mb-8 text-center max-w-2xl md:max-w-3xl mx-auto drop-shadow-sm">
              Crie o hambúrguer dos seus sonhos escolhendo pão, carne, queijos,
              molhos e acompanhamentos do seu jeito!
              <br />
              <span className="text-gray-500">
                Experimente combinações exclusivas e personalize cada detalhe do
                seu pedido.
              </span>
            </p>
            <a
              href="/monte-seu-hamburguer"
              className="mt-2 px-10 py-4 rounded-2xl text-white font-extrabold text-xl shadow-lg bg-red-600 transition-all duration-200 drop-shadow-xl hover:scale-105 hover:shadow-[0_0_16px_4px_rgba(239,68,68,0.4)] inline-block text-center"
            >
              MONTAR AGORA
            </a>
          </div>
        </section>

        {/* Container do carrossel 3D */}
        {combos.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-red-600">
              Combos Especiais
            </h2>
            <div
              className="relative h-96 md:h-[440px] perspective-1000 overflow-visible px-2 sm:px-8"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              ref={carouselRef}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {combos.map((combo, index) => (
                  <div
                    key={combo.id}
                    className="absolute left-1/2 top-1/2 w-[95vw] max-w-[340px] sm:w-80 sm:max-w-md md:w-[420px] md:max-w-xl h-[250px] sm:h-[350px] md:h-[400px] transition-transform duration-500 flex items-stretch"
                    style={{
                      ...getCardStyle(index),
                      transform: `translate(-50%, -50%) ${
                        getCardStyle(index).transform
                          ? getCardStyle(index).transform
                          : ""
                      }`,
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-red-100 via-white to-red-200 border-2 border-red-400 rounded-3xl shadow-xl p-3 sm:p-6 md:p-8 pb-6 md:pb-6 flex flex-col items-center transform-style-preserve-3d md:space-y-6">
                      <div className="flex flex-col items-center w-full flex-1 justify-center">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-red-700 mb-1 sm:mb-2 md:mb-4 text-center">
                          {combo.nome}
                        </h2>
                        <p className="text-gray-700 mb-2 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base text-center">
                          {combo.descricao}
                        </p>
                        <div className="flex justify-center items-end gap-2 md:gap-6 mb-2 sm:mb-4 md:mb-6 flex-wrap sm:flex-nowrap">
                          <div className="flex flex-col items-center">
                            <img
                              src={combo.produtoHamburguer?.imagem}
                              alt={combo.produtoHamburguer?.nome}
                              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-red-400 shadow"
                            />
                            <span className="mt-1 text-gray-500 text-[10px] sm:text-xs line-through">
                              R${" "}
                              {combo.produtoHamburguer?.preco
                                ?.toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={combo.produtoBebida?.imagem}
                              alt={combo.produtoBebida?.nome}
                              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-red-400 shadow"
                            />
                            <span className="mt-1 text-gray-500 text-[10px] sm:text-xs line-through">
                              R${" "}
                              {combo.produtoBebida?.preco
                                ?.toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={combo.produtoSobremesa?.imagem}
                              alt={combo.produtoSobremesa?.nome}
                              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-red-400 shadow"
                            />
                            <span className="mt-1 text-gray-500 text-[10px] sm:text-xs line-through">
                              R${" "}
                              {combo.produtoSobremesa?.preco
                                ?.toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
                          <span className="text-lg font-bold text-gray-700">
                            Preço:
                          </span>
                          <span className="text-2xl font-extrabold text-red-600">
                            R$ {combo.precoCombo.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-center -mt-3 md:mt-0 md:mb-2 w-full">
                          <button
                            onClick={() => {
                              addToCart({
                                id: combo.id,
                                nome: combo.nome,
                                descricao: combo.descricao,
                                preco: combo.precoCombo,
                                imagem: combo.produtoHamburguer?.imagem || "",
                                type: "combo",
                                produtos: [
                                  combo.produtoHamburguer,
                                  combo.produtoBebida,
                                  combo.produtoSobremesa,
                                ],
                                produtoHamburguer: combo.produtoHamburguer,
                                produtoBebida: combo.produtoBebida,
                                produtoSobremesa: combo.produtoSobremesa,
                              } as any);
                            }}
                            className="w-40 h-9 md:w-56 md:h-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 text-2xl md:text-3xl"
                            title="Adicionar ao Carrinho"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 md:h-7 md:w-7"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Carrinho
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              {combos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    if (autoRotateInterval.current) {
                      clearInterval(autoRotateInterval.current);
                    }
                    autoRotateInterval.current = setInterval(() => {
                      setCurrentIndex((prev) => (prev + 1) % combos.length);
                    }, 5000);
                  }}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === index ? "bg-red-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Restante do conteúdo (produtos por categoria) */}
        <div className="space-y-12">
          {Object.entries(produtosPorCategoria).map(([categoria, produtos]) => (
            <div
              key={categoria}
              id={`categoria-${categoria.toLowerCase().replace(/\s+/g, "-")}`}
              className="space-y-6"
            >
              <h2 className="text-2xl justify-center font-bold text-black pb-2 flex items-center">
                {categoria === "HAMBURGUER" && (
                  <FaHamburger className="h-6 w-6 text-red-500 mr-2" />
                )}
                {categoria === "BEBIDA" && (
                  <FaGlassMartiniAlt className="h-6 w-6 text-red-500 mr-2" />
                )}
                {categoria === "SOBREMESA" && (
                  <FaIceCream className="h-6 w-6 text-red-500 mr-2" />
                )}
                {categoria !== "HAMBURGUER" &&
                  categoria !== "BEBIDA" &&
                  categoria !== "SOBREMESA" && (
                    <span className="h-6 w-6 mr-2"></span>
                  )}
                {categoria}
              </h2>

              <div className="flex flex-wrap justify-center gap-6">
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className="w-full sm:w-auto lg:w-1/3 xl:w-1/4 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-red-500/60 hover:scale-[1.02]"
                  >
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
                    </div>

                    <div className="flex flex-col flex-grow p-5 overflow-hidden">
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
                        {produto.nome}
                      </h3>
                      <div>
                        <p className="font-medium text-gray-500 mb-1 text-center uppercase tracking-wide">
                          Descrição
                        </p>
                        <p className="text-gray-700 text-center text-base">
                          {produto.descricao}
                        </p>
                      </div>
                      <p className="font-medium text-gray-500 mb-1 text-center uppercase tracking-wide">
                        Preço
                      </p>
                      <p className="text-red-600 font-bold text-2xl text-center">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                      <div className="mt-auto pt-6">
                        <button
                          onClick={() => addToCart(produto)}
                          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200 mt-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Adicionar ao Carrinho
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
