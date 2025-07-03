import { useEffect, useState } from "react";
import {
  FaCheck,
  FaHamburger,
  FaMotorcycle,
  FaRegClock,
  FaThumbsUp,
} from "react-icons/fa";
import { PedidoService } from "../../server/api";
import "../../Style.css";
import type { Pedido } from "../../Type";
import Footer from "../Base/Footer";
import { useUser } from "./UserContext";

const statuses = [
  "PENDENTE",
  "PREPARANDO",
  "PRONTO",
  "A_CAMINHO",
  "ENTREGUE",
] as const;
const statusLabels: Record<(typeof statuses)[number], string> = {
  PENDENTE: "Pendente",
  PREPARANDO: "Preparando",
  PRONTO: "Pronto",
  A_CAMINHO: "A caminho",
  ENTREGUE: "Entregue",
};

const statusIcons = {
  PENDENTE: <FaRegClock className="text-red-600" title="Pendente" size={25} />,
  PREPARANDO: (
    <FaHamburger className="text-red-600" title="Preparando" size={25} />
  ),
  PRONTO: <FaThumbsUp className="text-red-600" title="Pronto" size={25} />,
  A_CAMINHO: (
    <FaMotorcycle className="text-red-600" title="A caminho" size={25} />
  ),
  ENTREGUE: <FaCheck className="text-red-600" title="Entregue" size={25} />,
};

export default function OrderTracking() {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user) return;
      try {
        const pedidos = await PedidoService.listarPedidosCliente(user.id);
        setOrders(pedidos);
      } catch (err: any) {
        return err;
      }
    };
    fetchPedidos();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative pt-5">
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-4xl p-6 space-y-8">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Seus Pedidos
              </h2>
              <div className="w-6"></div>
            </div>

            {orders.length === 0 ? (
              <p className="text-center text-gray-600">
                Nenhum pedido encontrado.
              </p>
            ) : (
              <ul className="space-y-6">
                {orders.map((order) => {
                  const currentIndex = statuses.indexOf(order.status as any);
                  const stepPercent =
                    (currentIndex / (statuses.length - 1)) * 100;

                  // Verificação segura para order.total
                  const total = order?.total || 0; // Usa 0 como fallback se total for undefined

                  return (
                    <li
                      key={order.id}
                      className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
                    >
                      <div className="text-center mb-6">
                        <p className="text-gray-600 font-medium">
                          {formatDate(order.data)}
                        </p>
                      </div>

                      {/* Barra de progresso */}
                      <div className="relative h-12 mb-8">
                        <div className="absolute top-[26px] left-0 w-full h-1 bg-gray-200 rounded-full" />
                        <div
                          className="absolute top-[26px] h-1 bg-red-600 rounded-full"
                          style={{ width: `${stepPercent}%` }}
                        />
                        {/* Ícone do status atual */}
                        <div
                          className="absolute -top-2 w-8 h-8 flex items-center justify-center text-red-600"
                          style={{ left: `calc(${stepPercent}% - 1rem)` }}
                        >
                          {
                            statusIcons[
                              order.status as keyof typeof statusIcons
                            ]
                          }
                        </div>
                        {/* Marcadores de etapas */}
                        <div className="absolute top-6 left-0 w-full flex justify-between">
                          {statuses.map((status, idx) => (
                            <span
                              key={status}
                              className={
                                `w-2 h-2 rounded-full transition-colors duration-300 ` +
                                (idx <= currentIndex
                                  ? "bg-red-600"
                                  : "bg-gray-300")
                              }
                            />
                          ))}
                        </div>
                        {/* Rótulos das etapas */}
                        <div className="absolute top-8 left-0 w-full flex justify-between text-xs text-gray-600">
                          {statuses.map((status) => (
                            <span key={status}>{statusLabels[status]}</span>
                          ))}
                        </div>
                      </div>

                      {/* Itens do pedido */}
                      <div className="mt-8">
                        <h4 className="font-semibold mb-3 text-gray-700">
                          Itens do pedido:
                        </h4>
                        <ul className="space-y-3">
                          {order.produtos?.map((item) => (
                            <li
                              key={item.id}
                              className="flex justify-between items-start"
                            >
                              <div className="flex-1">
                                <span className="text-gray-700">
                                  {item.produtoNome}
                                </span>
                                {item.customBurgerIngredientes &&
                                  item.customBurgerIngredientes.length > 0 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Ingredientes:{" "}
                                      {item.customBurgerIngredientes.join(", ")}
                                    </div>
                                  )}
                              </div>
                              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                x{item.quantidade}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Total do pedido */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-medium text-gray-600">
                          Total:
                        </span>
                        <span className="font-bold text-lg text-gray-800">
                          R$ {total.toFixed(2)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
