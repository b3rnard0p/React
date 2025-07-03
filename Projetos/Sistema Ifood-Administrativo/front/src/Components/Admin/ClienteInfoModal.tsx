import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface ClienteInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomeCliente: string;
  telefoneCliente: string;
  enderecoCliente: string;
  formaPagamento: string;
}

const ClienteInfoModal: React.FC<ClienteInfoModalProps> = ({
  isOpen,
  onClose,
  nomeCliente,
  telefoneCliente,
  enderecoCliente,
  formaPagamento,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-200 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/80 hover:bg-red-100 text-red-600 rounded-full p-2 shadow transition-colors z-10"
              title="Fechar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6"
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
                Informações do Cliente
              </h2>
              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  <div>
                    <span className="block text-xs font-semibold text-red-600 uppercase mb-1 tracking-wider">
                      Nome
                    </span>
                    <div className="bg-white/80 border border-red-200 rounded-lg px-4 py-2 text-gray-900 shadow-sm">
                      {nomeCliente}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-red-600 uppercase mb-1 tracking-wider">
                      Telefone
                    </span>
                    <div className="bg-white/80 border border-red-200 rounded-lg px-4 py-2 text-gray-900 shadow-sm">
                      {telefoneCliente || "Não informado"}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-red-600 uppercase mb-1 tracking-wider">
                      Endereço
                    </span>
                    <div className="bg-white/80 border border-red-200 rounded-lg px-4 py-2 text-gray-900 shadow-sm">
                      {enderecoCliente || "Não informado"}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-red-600 uppercase mb-1 tracking-wider">
                      Forma de Pagamento
                    </span>
                    <div className="bg-white/80 border border-red-200 rounded-lg px-4 py-2 text-gray-900 shadow-sm">
                      {formaPagamento === "CARTAO" && "Cartão"}
                      {formaPagamento === "PIX" && "PIX"}
                      {formaPagamento === "DINHEIRO" && "Dinheiro"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClienteInfoModal;
