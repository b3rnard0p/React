// src/Components/Cart/Cart.tsx
import { useState } from "react";
import "../../Style.css";
import type {
  CartItem,
  ComboCartItem,
  CreatePedidoRequest,
  CustomBurgerCartItem,
  ProdutoPedidoRequest,
} from "../../Type.ts";
import { PedidoService } from "../../server/api.ts";
import Footer from "../Base/Footer.tsx";
import { useCart } from "./Context.tsx";
import { useUser } from "./UserContext";

export function Cart() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const { user, hasUser } = useUser();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<
    "CARTAO" | "PIX" | "DINHEIRO"
  >("CARTAO");

  // Agrupa produtos, combos e custom burgers separadamente
  const groupedItems: { produto: CartItem; quantidade: number }[] =
    cartItems.reduce<{ produto: CartItem; quantidade: number }[]>(
      (acc, item) => {
        // Se for combo ou custom burger, não agrupa, adiciona como item único
        if (
          (item as ComboCartItem).type === "combo" ||
          (item as CustomBurgerCartItem).tipo === "custom-burger"
        ) {
          acc.push({ produto: item, quantidade: 1 });
        } else {
          const existing = acc.find((x) => x.produto.id === item.id);
          if (existing) {
            existing.quantidade += 1;
          } else {
            acc.push({ produto: item, quantidade: 1 });
          }
        }
        return acc;
      },
      []
    );

  const handleFinalize = async () => {
    if (cartItems.length === 0) return;
    if (!hasUser || !user) {
      return;
    }

    setSuccessMessage(null);

    // Monta os produtos do pedido, incluindo todos os produtos do combo e custom burgers
    let produtosPedido: ProdutoPedidoRequest[] = [];
    groupedItems.forEach(({ produto, quantidade }) => {
      if ((produto as ComboCartItem).type === "combo") {
        const combo = produto as ComboCartItem;
        if (Array.isArray(combo.produtos)) {
          combo.produtos.forEach((prod) => {
            produtosPedido.push({
              produtoId: prod.id,
              quantidade,
              precoUnitario: 0, // O preço do combo está no item combo, não nos produtos individuais
            });
          });
        }
      } else if ((produto as CustomBurgerCartItem).tipo === "custom-burger") {
        const customBurger = produto as CustomBurgerCartItem;
        // Adiciona o custom burger como um item único
        produtosPedido.push({
          produtoId: 0, // Será substituído pelo customBurgerId no backend
          quantidade,
          precoUnitario: customBurger.preco,
          customBurgerId: customBurger.customBurgerId,
        });
      } else {
        produtosPedido.push({
          produtoId: Number(produto.id),
          quantidade,
          precoUnitario: produto.preco,
        });
      }
    });

    const payload: CreatePedidoRequest = {
      produtos: produtosPedido,
      total: cartTotal,
      usuarioId: user.id,
      formaPagamento: formaPagamento,
    };

    console.log("Payload sendo enviado:", payload);

    try {
      const pedidoCriado = await PedidoService.criarPedido(payload);
      setSuccessMessage(`Pedido #${pedidoCriado.id} criado com sucesso!`);
      clearCart();
    } catch (err: any) {
      console.error("Erro ao criar pedido:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);

      let errorMessage = "Erro ao finalizar pedido. ";
      if (err.response?.status === 403) {
        errorMessage += "Acesso negado. Verifique se você está logado.";
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Tente novamente.";
      }
    }
  };

  return (
    <div className="relative pt-5">
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
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
              <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Carrinho
              </h2>
              <div className="w-6"></div>
            </div>

            {successMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                <p>{successMessage}</p>
              </div>
            )}

            {!hasUser && (
              <div className="bg-yellow-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p>
                    <strong>Atenção:</strong> Você precisa completar seu
                    cadastro para finalizar o pedido.{" "}
                    <a href="/perfil" className="underline font-semibold">
                      Cadastrar-se
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            {groupedItems.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-600 text-lg">Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  {groupedItems.map(({ produto, quantidade }) => {
                    const isCustomBurger =
                      (produto as CustomBurgerCartItem).tipo ===
                      "custom-burger";
                    const customBurger = produto as CustomBurgerCartItem;

                    return (
                      <div
                        key={produto.id}
                        className="p-4 border-b border-gray-100 last:border-b-0 flex justify-between items-center"
                      >
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-800">
                              {produto.nome}{" "}
                              <span className="text-gray-500">
                                x{quantidade}
                              </span>
                            </h3>
                            <p className="text-gray-800 font-medium">
                              R${" "}
                              {(produto.preco * quantidade)
                                .toFixed(2)
                                .replace(".", ",")}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            R$ {produto.preco.toFixed(2).replace(".", ",")} cada
                          </p>
                          {isCustomBurger && customBurger.ingredientes && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600">
                                Ingredientes:{" "}
                                {customBurger.ingredientes
                                  .map((i) => i.nome)
                                  .join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (isCustomBurger) {
                              // Para custom burgers, o id é string, então usamos o customBurgerId
                              removeFromCart(customBurger.customBurgerId);
                            } else {
                              // Para produtos normais e combos, o id é number
                              removeFromCart(produto.id as number);
                            }
                          }}
                          className="ml-4 text-red-600 hover:text-red-800 transition-colors duration-200"
                          aria-label="Remover item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Resumo do pedido */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Resumo do Pedido
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        R$ {cartTotal.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa de entrega:</span>
                      <span className="font-medium">R$ 5,00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-lg font-semibold text-gray-800">
                        Total:
                      </span>
                      <span className="text-lg font-semibold text-red-600">
                        R$ {(cartTotal + 5).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>

                  {/* Forma de pagamento */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forma de Pagamento
                    </label>
                    <select
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="CARTAO">Cartão de Crédito/Débito</option>
                      <option value="PIX">PIX</option>
                      <option value="DINHEIRO">Dinheiro</option>
                    </select>
                  </div>

                  {/* Botão finalizar */}
                  <button
                    onClick={handleFinalize}
                    disabled={!hasUser || cartItems.length === 0}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    {hasUser ? "Finalizar Pedido" : "Complete seu cadastro"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
