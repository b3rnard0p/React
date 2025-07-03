import React, { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCheck,
  FaHamburger,
  FaMotorcycle,
  FaRegCalendarAlt,
  FaRegClock,
  FaThumbsUp,
} from "react-icons/fa";
import { PedidoService } from "../../server/api.ts";
import "../../Style.css";
import type { Pedido } from "../../Type.ts";
import ClienteInfoModal from "./ClienteInfoModal";

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
  PENDENTE: <FaRegClock className="text-red-600" title="Pendente" />,
  PREPARANDO: <FaHamburger className="text-red-600" title="Preparando" />,
  PRONTO: <FaThumbsUp className="text-red-600" title="Pronto" />,
  A_CAMINHO: <FaMotorcycle className="text-red-600" title="A caminho" />,
  ENTREGUE: <FaCheck className="text-red-600" title="Entregue" />,
};

type StatusStepperAdminProps = {
  statusAtual: string;
  onChangeStatus: (novoStatus: string) => void;
};

const StatusStepperAdmin: React.FC<StatusStepperAdminProps> = ({
  statusAtual,
  onChangeStatus,
}) => {
  const [dragging, setDragging] = useState(false);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragPercent, setDragPercent] = useState<number | null>(null);
  const currentIndex = statuses.indexOf(statusAtual as any);
  const stepperRef = React.useRef<HTMLDivElement>(null);

  // Calcula a posição visual da barrinha/bolinha
  let visualPercent: number;
  if (dragging && dragPercent !== null) {
    visualPercent = dragPercent;
  } else {
    visualPercent = (currentIndex / (statuses.length - 1)) * 100;
  }

  // Calcula o índice visual mais próximo do mouse (para highlight dos marcadores)
  let visualIndex = currentIndex;
  if (dragging && dragPercent !== null) {
    const idx = Math.round((dragPercent / 100) * (statuses.length - 1));
    visualIndex = Math.max(0, Math.min(statuses.length - 1, idx));
  }

  return (
    <div
      className="relative h-12 mb-4 select-none"
      ref={stepperRef}
      onDragOver={(e) => {
        e.preventDefault();
        if (dragging && stepperRef.current) {
          const rect = stepperRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          let percent = (x / rect.width) * 100;
          percent = Math.max(0, Math.min(100, percent));
          setDragPercent(percent);
        }
      }}
      onDragEnd={() => {
        setDragPercent(null);
      }}
      onDrop={(e) => {
        if (dragging && stepperRef.current) {
          const rect = stepperRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          let percent = (x / rect.width) * 100;
          percent = Math.max(0, Math.min(100, percent));
          const idx = Math.round((percent / 100) * (statuses.length - 1));
          if (idx > currentIndex) {
            setDragging(false);
            setDragOverIdx(null);
            setDragPercent(null);
            onChangeStatus(statuses[idx]);
          } else {
            setDragging(false);
            setDragOverIdx(null);
            setDragPercent(null);
          }
        }
      }}
    >
      {/* Linha de fundo */}
      <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 rounded-full" />
      {/* Linha preenchida */}
      <div
        className="absolute top-8 h-1 bg-red-600 rounded-full transition-all duration-75"
        style={{ width: `${visualPercent}%` }}
      />
      {/* Ícone do status atual acima da linha, acompanha a bolinha e gira se arrastando */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-0.5rem",
          left:
            dragging && dragPercent !== null
              ? `calc(${visualPercent}% - 1rem)`
              : `calc(${(currentIndex / (statuses.length - 1)) * 100}% - 1rem)`,
        }}
      >
        <span
          className={`text-2xl text-red-600 flex items-center justify-center ${
            dragging ? "spin-fast" : ""
          }`}
        >
          {statusIcons[statuses[visualIndex]]}
        </span>
      </div>
      {/* Marcadores de etapas (bolinha) */}
      <div className="absolute top-6 left-0 w-full flex justify-between">
        {statuses.map((status, idx) => (
          <div
            key={status}
            draggable={
              idx === currentIndex && currentIndex < statuses.length - 1
            }
            onDragStart={(e) => {
              if (idx === currentIndex && currentIndex < statuses.length - 1) {
                setDragging(true);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", statusAtual);
              }
            }}
            onDragEnd={() => {
              setDragging(false);
              setDragOverIdx(null);
              setDragPercent(null);
            }}
            onDrop={(e) => {
              if (dragging && idx > currentIndex) {
                e.preventDefault();
                setDragging(false);
                setDragOverIdx(null);
                setDragPercent(null);
                onChangeStatus(statuses[idx]);
              } else {
                setDragging(false);
                setDragOverIdx(null);
                setDragPercent(null);
              }
            }}
            onClick={() => {
              if (!dragging && idx > currentIndex) {
                onChangeStatus(statuses[idx]);
              }
            }}
            className={`flex flex-col items-center w-5 group ${
              idx > currentIndex ? "cursor-pointer" : "cursor-default"
            }`}
            title={statusLabels[status]}
          >
            {/* Bolinha vermelha se já passou ou atual, bolinha cinza se futuro */}
            {idx <= visualIndex ? (
              <span className="w-5 h-5 rounded-full bg-red-600 shadow-lg border-2 border-white"></span>
            ) : (
              <span className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></span>
            )}
          </div>
        ))}
      </div>
      {/* Rótulos das etapas */}
      <div className="absolute top-11 left-0 w-full flex justify-between text-xs text-gray-600">
        {statuses.map((status) => (
          <span key={status} className="flex flex-col items-center">
            {statusLabels[status]}
          </span>
        ))}
      </div>
    </div>
  );
};

// Custom input invisível para o datepicker
const CustomInput = forwardRef<HTMLInputElement>((props, ref) => (
  <input {...props} ref={ref} style={{ display: "none" }} />
));

function PedidoList() {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [clienteModalOpen, setClienteModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<{
    nome: string;
    telefone: string;
    endereco: string;
    formaPagamento: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Atualiza o status do pedido localmente
  const updateOrderStatusLocal = (
    pedidoId: number,
    novoStatus: Pedido["status"]
  ) => {
    setOrders((prev) => {
      const updated = prev.map((order) =>
        order.id === pedidoId ? { ...order, status: novoStatus } : order
      );
      return updated;
    });
  };

  const fetchOrders = async () => {
    try {
      const pedidos = await PedidoService.listarPedidos();
      setOrders(pedidos);
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    pedidoId: number,
    novoStatus: "PENDENTE" | "PREPARANDO" | "PRONTO" | "A_CAMINHO" | "ENTREGUE"
  ) => {
    updateOrderStatusLocal(pedidoId, novoStatus); // feedback imediato
    try {
      await PedidoService.atualizarStatus(pedidoId, { status: novoStatus });
    } catch (error: any) {
      console.error("Erro ao atualizar status no backend:", error);
      fetchOrders();
    }
  };

  const handleClienteInfo = (pedido: Pedido) => {
    setSelectedCliente({
      nome: pedido.nomeCliente,
      telefone: pedido.telefoneCliente,
      endereco: pedido.enderecoCliente,
      formaPagamento: pedido.formaPagamento,
    });
    setClienteModalOpen(true);
  };

  // Filtro por data
  const filteredOrders = selectedDate
    ? orders.filter(
        (order) =>
          order.data.slice(0, 10) === selectedDate.toISOString().slice(0, 10)
      )
    : orders;

  return (
    <div className="container mx-auto px-4 py-30 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <a href="/admin" className="text-white hover:text-red-600">
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
          Pedidos
        </h2>
        <div className="flex items-center gap-2 relative">
          <button
            className="text-white hover:text-red-600 focus:outline-none"
            onClick={() => setShowCalendar(true)}
            title="Filtrar por data"
          >
            <FaRegCalendarAlt size={24} />
          </button>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setShowCalendar(false);
            }}
            open={showCalendar}
            onClickOutside={() => setShowCalendar(false)}
            customInput={<CustomInput />}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            popperPlacement="bottom-end"
            popperClassName="z-[9999]"
          />
        </div>
      </div>
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
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
          <p className="text-gray-500 text-lg">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <li
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-semibold text-red-600">
                    Pedido #{order.id}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.data).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Pagamento: {order.formaPagamento === "CARTAO" && "Cartão"}
                    {order.formaPagamento === "PIX" && "PIX"}
                    {order.formaPagamento === "DINHEIRO" && "Dinheiro"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleClienteInfo(order)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Cliente
                  </button>
                </div>
              </div>
              <div className="px-5 pt-2 pb-1">
                <div style={{ marginTop: "10px" }}>
                  <StatusStepperAdmin
                    statusAtual={order.status}
                    onChangeStatus={(novoStatus) => {
                      handleStatusChange(order.id, novoStatus as any);
                    }}
                  />
                </div>
                <div className="border-t border-gray-200 my-4 mt-6" />
              </div>
              <ul className="divide-y divide-gray-100">
                {order.produtos.map((ppp) => (
                  <li
                    key={ppp.id}
                    className="px-5 py-3 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <span className="text-gray-800">{ppp.produtoNome}</span>
                      {ppp.customBurgerIngredientes &&
                        ppp.customBurgerIngredientes.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Ingredientes:{" "}
                            {ppp.customBurgerIngredientes.join(", ")}
                          </div>
                        )}
                    </div>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      x{ppp.quantidade}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {selectedCliente && (
        <ClienteInfoModal
          isOpen={clienteModalOpen}
          onClose={() => setClienteModalOpen(false)}
          nomeCliente={selectedCliente.nome}
          telefoneCliente={selectedCliente.telefone}
          enderecoCliente={selectedCliente.endereco}
          formaPagamento={selectedCliente.formaPagamento}
        />
      )}
    </div>
  );
}

export default PedidoList;
