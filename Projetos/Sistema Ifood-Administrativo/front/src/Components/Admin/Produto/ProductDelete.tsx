import { AnimatePresence, motion } from "framer-motion";
import type { DeleteConfirmationModalProps } from "../../../Type.ts";

export function ProductDelete({
  isOpen,
  onClose,
  onConfirm,
  children,
}: DeleteConfirmationModalProps) {
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
