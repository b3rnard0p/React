// src/Components/Cart/Cart.tsx
import  { useState } from 'react';
import { useCart } from './Context.tsx';
import type { Produto } from '../../Type.ts';
import '../../Style.css';
import { api } from '../../server/api.ts';

interface GroupedItem {
    produto: Produto;
    quantidade: number;
}

export function Cart() {
    const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Agrupa itens iguais e conta quantidade
    const groupedItems: GroupedItem[] = cartItems.reduce<GroupedItem[]>((acc, item) => {
        const existing = acc.find(x => x.produto.id === item.id);
        if (existing) {
            existing.quantidade += 1;
        } else {
            acc.push({ produto: item, quantidade: 1 });
        }
        return acc;
    }, []);

    const handleFinalize = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const payload = {
            itens: groupedItems.map(({ produto, quantidade }) => ({
                produtoId: produto.id,
                quantidade
            }))
        };

        try {
            const response = await api.post('/pedidos', payload);
            const data = response.data;
            setSuccessMessage(`Pedido #${data.id} criado com sucesso!`);
            clearCart();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Erro desconhecido';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Seu Carrinho
            </h2>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>{error}</p>
                </div>
            )}
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                    <p>{successMessage}</p>
                </div>
            )}

            {groupedItems.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-600 text-lg">Seu carrinho está vazio</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        {groupedItems.map(({ produto, quantidade }) => (
                            <div key={produto.id} className="p-4 border-b border-gray-100 last:border-b-0 flex justify-between items-center">
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-gray-800">
                                            {produto.nome} <span className="text-gray-500">x{quantidade}</span>
                                        </h3>
                                        <p className="text-gray-800 font-medium">
                                            R$ {(produto.preco * quantidade).toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        R$ {produto.preco.toFixed(2).replace('.', ',')} cada
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(produto.id)}
                                    className="ml-4 text-red-600 hover:text-red-800 transition-colors duration-200"
                                    aria-label="Remover item"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Total:</h3>
                            <p className="text-xl font-bold text-red-600">
                                R$ {cartTotal.toFixed(2).replace('.', ',')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                onClick={clearCart}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Limpar Carrinho
                            </button>
                            <button
                                onClick={handleFinalize}
                                disabled={loading}
                                className={`px-4 py-2 rounded-md text-white transition-colors duration-200 flex items-center justify-center ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Finalizando...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Finalizar Pedido
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
